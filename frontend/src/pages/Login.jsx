import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  Grid,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Digite um e-mail válido')
    .required('E-mail é obrigatório'),
  password: yup
    .string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .required('Senha é obrigatória'),
});

export default function Login() {
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      barbershopName: '',
      barbershopAddress: '',
      barbershopPhone: '',
      barbershopEmail: '',
      ownerName: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isRegistering) {
          // Lógica de cadastro
          const response = await api.post('/auth/register', {
            name: values.ownerName,
            email: values.email,
            password: values.password,
            role: 'admin',
            barbershop: {
              name: values.barbershopName,
              address: values.barbershopAddress,
              phone: values.barbershopPhone,
              email: values.barbershopEmail,
            },
          });
          
          if (response.data) {
            alert('Cadastro realizado com sucesso! Faça login para continuar.');
            setIsRegistering(false);
            formik.resetForm();
          }
        } else {
          await login(values.email, values.password);
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Erro:', err);
        setError(isRegistering ? 'Erro ao cadastrar: ' + (err.response?.data?.error || 'Erro desconhecido') : 'E-mail ou senha inválidos');
      }
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5">
            {isRegistering ? 'Cadastro de Barbearia' : 'Login'}
          </Typography>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ mt: 1, width: '100%' }}
          >
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {isRegistering && (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Nome da Barbearia"
                  name="barbershopName"
                  value={formik.values.barbershopName}
                  onChange={formik.handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Endereço"
                  name="barbershopAddress"
                  value={formik.values.barbershopAddress}
                  onChange={formik.handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Telefone"
                  name="barbershopPhone"
                  value={formik.values.barbershopPhone}
                  onChange={formik.handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Email da Barbearia"
                  name="barbershopEmail"
                  value={formik.values.barbershopEmail}
                  onChange={formik.handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Nome do Proprietário"
                  name="ownerName"
                  value={formik.values.ownerName}
                  onChange={formik.handleChange}
                />
              </>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail"
              name="email"
              autoComplete="email"
              autoFocus
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                >
                  {isRegistering ? 'Cadastrar' : 'Entrar'}
                </Button>
              </Grid>
              <Grid item xs={6}>
                {!isRegistering && (
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setIsRegistering(true)}
                  >
                    Primeiro Acesso
                  </Button>
                )}
              </Grid>
            </Grid>

            {isRegistering && (
              <Button
                fullWidth
                variant="text"
                sx={{ mt: 2 }}
                onClick={() => setIsRegistering(false)}
              >
                Já tem uma conta? Faça login
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 