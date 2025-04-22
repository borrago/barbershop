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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import api from '../../services/api';

const validationSchema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('E-mail inválido'),
  phone: yup.string(),
  birth_date: yup.date().nullable(),
});

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      birth_date: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (editingId) {
          await api.put(`/clients/${editingId}`, values);
        } else {
          await api.post('/clients', values);
        }
        loadClients();
        handleClose();
      } catch (err) {
        setError('Erro ao salvar cliente: ' + (err.response?.data?.error || 'Erro desconhecido'));
      }
    },
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const response = await api.get('/clients');
      setClients(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar clientes: ' + (err.response?.data?.error || 'Erro desconhecido'));
    }
  };

  const handleOpen = (client = null) => {
    if (client) {
      setEditingId(client.id);
      formik.setValues({
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        birth_date: client.birth_date ? client.birth_date.split('T')[0] : '',
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
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await api.delete(`/clients/${id}`);
        loadClients();
      } catch (err) {
        setError('Erro ao excluir cliente: ' + (err.response?.data?.error || 'Erro desconhecido'));
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Não informado';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Clientes</Typography>
        <Button variant="contained" onClick={() => handleOpen()}>
          Novo Cliente
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
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Data de Nascimento</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.email || 'Não informado'}</TableCell>
                <TableCell>{client.phone || 'Não informado'}</TableCell>
                <TableCell>{formatDate(client.birth_date)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(client)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(client.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingId ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              label="Nome"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Telefone"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Data de Nascimento"
              name="birth_date"
              type="date"
              value={formik.values.birth_date}
              onChange={formik.handleChange}
              InputLabelProps={{ shrink: true }}
            />
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
