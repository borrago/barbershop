import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import './styles.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, signed } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    // Dados da barbearia (apenas no cadastro)
    barbershopName: '',
    barbershopAddress: '',
    barbershopPhone: '',
    barbershopEmail: '',
    ownerName: '',
  });

  useEffect(() => {
    console.log('Login - useEffect - signed:', signed);
    if (signed) {
      console.log('Login - useEffect - Usuário autenticado, redirecionando para /dashboard');
      navigate('/dashboard');
    }
  }, [signed, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log('Login - handleLogin - Iniciando login');
      await login(formData.email, formData.password);
      console.log('Login - handleLogin - Login realizado com sucesso');
    } catch (error) {
      console.error('Login - handleLogin - Erro:', error);
      alert('Erro ao fazer login: ' + error.response?.data?.error || 'Erro desconhecido');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      console.log('Login - handleRegister - Iniciando cadastro');
      const response = await api.post('/auth/register', {
        name: formData.ownerName,
        email: formData.email,
        password: formData.password,
        role: 'admin',
        barbershop: {
          name: formData.barbershopName,
          address: formData.barbershopAddress,
          phone: formData.barbershopPhone,
          email: formData.barbershopEmail,
        },
      });
      console.log('Login - handleRegister - Cadastro realizado com sucesso');
      alert('Cadastro realizado com sucesso! Faça login para continuar.');
      setIsRegistering(false);
    } catch (error) {
      console.error('Login - handleRegister - Erro:', error);
      alert('Erro ao cadastrar: ' + error.response?.data?.error || 'Erro desconhecido');
    }
  };

  return (
    <Container className="login-container">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="login-card">
            <Card.Body>
              <h2 className="text-center mb-4">
                {isRegistering ? 'Cadastro de Barbearia' : 'Login'}
              </h2>
              
              <Form onSubmit={isRegistering ? handleRegister : handleLogin}>
                {isRegistering && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Label>Nome da Barbearia</Form.Label>
                      <Form.Control
                        type="text"
                        name="barbershopName"
                        value={formData.barbershopName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Endereço</Form.Label>
                      <Form.Control
                        type="text"
                        name="barbershopAddress"
                        value={formData.barbershopAddress}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Telefone</Form.Label>
                      <Form.Control
                        type="tel"
                        name="barbershopPhone"
                        value={formData.barbershopPhone}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email da Barbearia</Form.Label>
                      <Form.Control
                        type="email"
                        name="barbershopEmail"
                        value={formData.barbershopEmail}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Nome do Proprietário</Form.Label>
                      <Form.Control
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <div className="buttons-container">
                  <Button variant="primary" type="submit" className="flex-grow-1">
                    {isRegistering ? 'Cadastrar' : 'Entrar'}
                  </Button>

                  {!isRegistering && (
                    <Button
                      variant="outline-primary"
                      className="flex-grow-1"
                      onClick={() => setIsRegistering(true)}
                    >
                      Primeiro Acesso
                    </Button>
                  )}
                </div>

                {isRegistering && (
                  <Button
                    variant="link"
                    className="w-100 mt-3"
                    onClick={() => setIsRegistering(false)}
                  >
                    Já tem uma conta? Faça login
                  </Button>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login; 