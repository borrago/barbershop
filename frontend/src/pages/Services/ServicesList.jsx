import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data);
    } catch (error) {
      setError('Erro ao carregar serviços: ' + error.response?.data?.error || 'Erro desconhecido');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        await api.delete(`/services/${id}`);
        loadServices();
      } catch (error) {
        setError('Erro ao excluir serviço: ' + error.response?.data?.error || 'Erro desconhecido');
      }
    }
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Serviços</h1>
        <Button as={Link} to="/services/new" variant="primary">
          Novo Serviço
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Preço</th>
            <th>Duração (minutos)</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td>{service.name}</td>
              <td>R$ {service.price.toFixed(2)}</td>
              <td>{service.duration}</td>
              <td>
                <Button
                  as={Link}
                  to={`/services/${service.id}`}
                  variant="info"
                  size="sm"
                  className="me-2"
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(service.id)}
                >
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ServicesList; 