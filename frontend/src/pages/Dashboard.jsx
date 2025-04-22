import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalClients: 0,
    totalServices: 0,
    totalBarbershops: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [appointments, clients, services, barbershops] = await Promise.all([
          api.get('/appointments'),
          api.get('/clients'),
          api.get('/services'),
          api.get('/barbershops'),
        ]);

        setStats({
          totalAppointments: appointments.data.length,
          totalClients: clients.data.length,
          totalServices: services.data.length,
          totalBarbershops: barbershops.data.length,
        });
      } catch (error) {
        alert('Erro ao carregar estatísticas: ' + error.response?.data?.error || 'Erro desconhecido');
      }
    };

    loadStats();
  }, []);

  return (
    <Container>
      <h1 className="my-4">Dashboard</h1>
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Total de Agendamentos</Card.Title>
              <Card.Text>{stats.totalAppointments}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Total de Clientes</Card.Title>
              <Card.Text>{stats.totalClients}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Total de Serviços</Card.Title>
              <Card.Text>{stats.totalServices}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        {/* <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Total de Barbearias</Card.Title>
              <Card.Text>{stats.totalBarbershops}</Card.Text>
            </Card.Body>
          </Card>
        </Col> */}
      </Row>
    </Container>
  );
};

export default Dashboard; 