import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Barbershops = () => {
  const [barbershops, setBarbershops] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBarbershops();
  }, []);

  const loadBarbershops = async () => {
    try {
      const response = await api.get('/barbershops');
      setBarbershops(response.data);
    } catch (error) {
      setError('Erro ao carregar barbearias: ' + error.response?.data?.error || 'Erro desconhecido');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta barbearia?')) {
      try {
        await api.delete(`/barbershops/${id}`);
        loadBarbershops();
      } catch (error) {
        setError('Erro ao excluir barbearia: ' + error.response?.data?.error || 'Erro desconhecido');
      }
    }
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Barbearias</h1>
        <Button as={Link} to="/barbershops/new" variant="primary">
          Nova Barbearia
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Endereço</th>
            <th>Telefone</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {barbershops.map((barbershop) => (
            <tr key={barbershop.id}>
              <td>{barbershop.name}</td>
              <td>{barbershop.address}</td>
              <td>{barbershop.phone}</td>
              <td>{barbershop.email}</td>
              <td>
                <Button
                  as={Link}
                  to={`/barbershops/${barbershop.id}`}
                  variant="info"
                  size="sm"
                  className="me-2"
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(barbershop.id)}
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

export default Barbershops; 