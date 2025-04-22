import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import api from '../../services/api';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const formik = useFormik({
    initialValues: {
      appointment_date: null,
      client_id: '',
      user_id: '',
      services: [],
    },
    validationSchema: yup.object({
      appointment_date: yup.date().required('Data obrigatória'),
      client_id: yup.number().required('Cliente obrigatório'),
      user_id: yup.number().required('Barbeiro obrigatório'),
      services: yup.array().min(1, 'Escolha pelo menos um serviço'),
    }),
    onSubmit: async (values) => {
      const total_value = values.services.reduce((total, id) => {
        const service = services.find((s) => s.id === id);
        return total + Number(service?.value || 0);
      }, 0);

      const payload = {
        ...values,
        total_value,
        appointment_date: values.appointment_date.toISOString(),
      };

      try {
        if (editingId) {
          await api.put(`/appointments/${editingId}`, payload);
        } else {
          await api.post('/appointments', payload);
        }
        loadAppointments();
        handleClose();
      } catch (err) {
        console.error(err);
        setError('Erro ao salvar agendamento');
      }
    },
  });

  useEffect(() => {
    loadAppointments();
    loadClients();
    loadUsers();
    loadServices();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await api.get('/appointments');
      setAppointments(response.data);
    } catch (error) {
      setError(
        'Erro ao carregar agendamentos: ' +
          (error.response?.data?.error || 'Erro desconhecido')
      );
    }
  };

  const loadClients = async () => {
    const { data } = await api.get('/clients');
    setClients(data);
  };

  const loadUsers = async () => {
    const { data } = await api.get('/users');
    setUsers(data);
  };

  const loadServices = async () => {
    const { data } = await api.get('/services');
    setServices(data);
  };

  const handleOpen = (appointment = null) => {
    if (appointment) {
      setEditingId(appointment.id);
      formik.setValues({
        appointment_date: new Date(appointment.appointment_date),
        client_id: appointment.client_id,
        user_id: appointment.user_id,
        services:
          appointment.services?.map((s) => s.id) ||
          appointment.appointment_services?.map((as) => as.service_id) ||
          [],
      });
    } else {
      setEditingId(null);
      formik.resetForm();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    formik.resetForm();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      try {
        await api.delete(`/appointments/${id}`);
        loadAppointments();
      } catch (error) {
        setError(
          'Erro ao excluir agendamento: ' +
            (error.response?.data?.error || 'Erro desconhecido')
        );
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Agendamentos</Typography>
        <Button variant="contained" onClick={() => handleOpen()}>
          Novo Agendamento
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Barbeiro</TableCell>
              <TableCell>Serviços</TableCell>
              <TableCell>Valor Total</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>
                  {new Date(appointment.appointment_date).toLocaleString()}
                </TableCell>
                <TableCell>{appointment.client?.name || '—'}</TableCell>
                <TableCell>{appointment.user?.name || '—'}</TableCell>
                <TableCell>
                  {(appointment.services || appointment.appointment_services)?.map((as) => (
                    <Chip
                      key={as.service_id || as.id}
                      label={as.service?.name || as.name || 'Serviço'}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(appointment.total_value || 0)}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(appointment)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(appointment.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingId ? 'Editar Agendamento' : 'Novo Agendamento'}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DateTimePicker
                label="Data do Agendamento"
                value={formik.values.appointment_date}
                onChange={(value) => formik.setFieldValue('appointment_date', value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="normal"
                    error={formik.touched.appointment_date && Boolean(formik.errors.appointment_date)}
                    helperText={formik.touched.appointment_date && formik.errors.appointment_date}
                  />
                )}
              />
            </LocalizationProvider>

            <FormControl fullWidth margin="normal">
              <InputLabel>Cliente</InputLabel>
              <Select
                name="client_id"
                value={formik.values.client_id}
                onChange={formik.handleChange}
                error={formik.touched.client_id && Boolean(formik.errors.client_id)}
              >
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Barbeiro</InputLabel>
              <Select
                name="user_id"
                value={formik.values.user_id}
                onChange={formik.handleChange}
                error={formik.touched.user_id && Boolean(formik.errors.user_id)}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Serviços</InputLabel>
              <Select
                multiple
                name="services"
                value={formik.values.services}
                onChange={formik.handleChange}
                error={formik.touched.services && Boolean(formik.errors.services)}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((id) => {
                      const service = services.find((s) => s.id === id);
                      return <Chip key={id} label={service?.name || id} />;
                    })}
                  </Box>
                )}
              >
                {services.map((service) => (
                  <MenuItem key={service.id} value={service.id}>
                    {service.name} – R$
                    {new Intl.NumberFormat('pt-BR').format(service.value)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained">
              Salvar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
