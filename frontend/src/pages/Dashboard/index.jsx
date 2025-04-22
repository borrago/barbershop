import React from 'react';
import { Box, Container, Typography, Paper, Grid } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Welcome Card */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              color: 'white',
            }}
          >
            <Typography component="h1" variant="h4" gutterBottom>
              Bem-vindo, {user?.name}!
            </Typography>
            <Typography variant="h6" gutterBottom>
              Sistema de Gestão de Barbearia
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Aqui você pode gerenciar seus agendamentos, clientes e serviços.
            </Typography>
          </Paper>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 200,
              background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
              color: 'white',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Agendamentos Hoje
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              0
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 200,
              background: 'linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)',
              color: 'white',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Clientes
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              0
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 200,
              background: 'linear-gradient(45deg, #9C27B0 30%, #BA68C8 90%)',
              color: 'white',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Serviços
            </Typography>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              0
            </Typography>
          </Paper>
        </Grid>

        {/* Recent Appointments */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Próximos Agendamentos
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" color="text.secondary">
                Nenhum agendamento para hoje.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 