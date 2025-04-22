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
  MenuItem,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ptBR from 'date-fns/locale/pt-BR';
import api from '../../services/api';

const validationSchema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  birth_date: yup.date().required('Data de nascimento é obrigatória'),
  document: yup.string().required('Documento é obrigatório'),
  password: yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  role: yup.string().required('Função é obrigatória'),
});

export default function Users() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      birth_date: null,
      document: '',
      password: '',
      role: 'user',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const data = {
          ...values,
          birth_date: values.birth_date.toISOString(),
        };

        if (editingId) {
          await api.put(`/users/${editingId}`, data);
        } else {
          await api.post('/users/create', data);
        }

        loadUsers();
        handleClose();
      } catch (error) {
        setError('Erro ao salvar usuário: ' + (error.response?.data?.error || 'Erro desconhecido'));
      }
    },
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      setError('Erro ao carregar usuários: ' + (error.response?.data?.error || 'Erro desconhecido'));
    }
  };

  const handleOpen = (user = null) => {
    if (user) {
      setEditingId(user.id);
      formik.setValues({
        name: user.name,
        email: user.email,
        birth_date: new Date(user.birth_date),
        document: user.document,
        password: '',
        role: user.role,
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
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await api.delete(`/users/${id}`);
        loadUsers();
      } catch (error) {
        setError('Erro ao excluir usuário: ' + (error.response?.data?.error || 'Erro desconhecido'));
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Usuários</Typography>
        <Button variant="contained" onClick={() => handleOpen()}>
          Novo Usuário
        </Button>
      </Box>

      {error && <Typography variant="body2" color="error">{error}</Typography>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Documento</TableCell>
              <TableCell>Data de Nascimento</TableCell>
              <TableCell>Função</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.document}</TableCell>
                <TableCell>
                  {new Date(user.birth_date).toLocaleDateString()}
                </TableCell>
                <TableCell>{user.role === 'admin' ? 'Administrador' : 'Usuário'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {editingId ? 'Editar Usuário' : 'Novo Usuário'}
        </DialogTitle>
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
              label="E-mail"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label="Data de Nascimento"
                value={formik.values.birth_date}
                onChange={(date) => formik.setFieldValue('birth_date', date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="normal"
                    error={formik.touched.birth_date && Boolean(formik.errors.birth_date)}
                    helperText={formik.touched.birth_date && formik.errors.birth_date}
                  />
                )}
              />
            </LocalizationProvider>
            <TextField
              fullWidth
              margin="normal"
              label="Documento"
              name="document"
              value={formik.values.document}
              onChange={formik.handleChange}
              error={formik.touched.document && Boolean(formik.errors.document)}
              helperText={formik.touched.document && formik.errors.document}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Senha"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <TextField
              fullWidth
              margin="normal"
              select
              label="Função"
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              error={formik.touched.role && Boolean(formik.errors.role)}
              helperText={formik.touched.role && formik.errors.role}
            >
              <MenuItem value="admin">Administrador</MenuItem>
              <MenuItem value="user">Usuário</MenuItem>
            </TextField>
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
