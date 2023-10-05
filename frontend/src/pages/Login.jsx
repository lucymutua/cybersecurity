import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import imagen from '../../src/imagen/cyber.png';

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/user/login", formData);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        console.log("Token de acceso guardado en localStorage.");

        const userType = response.data.userType;

        userType === "admin" ? navigate("/") : navigate("/user");

        //userType === "admin" ? navigate("/user") : navigate("/usuario");
      } else {
        setError("No se recibió un token de acceso.");
      }
    } catch (error) {
      setError("Error al iniciar sesión. Verifica tus credenciales.");
      console.error("Error al iniciar sesión:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container style={{ minHeight: '75vh' }}>
        <Row className="justify-content-center" >

          <div className="image-container">
            <img className="img-fluid" src={imagen} alt="Cyber Security" />
          </div>

          <Col md={6} style={{ marginTop: '6rem' }}>
            <Card bg="white" text="dark">
              <Card.Body>
                <h2 className="card-title text-center mb-4">Iniciar sesión</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group>
                    <Form.Label>Nombre de usuario:</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      placeholder="Ingresa tu nombre de usuario"
                    />
                  </Form.Group>
                  <Form.Group style={{ marginTop: "20px" }}>
                    <Form.Label>Contraseña:</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      placeholder="Ingresa tu contraseña"
                    />
                  </Form.Group>
                  <Button
                    type="submit"
                    variant="primary"
                    className="btn-dark text-white mx-auto"
                    disabled={loading}
                  >
                    {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <section className="cta text-center my-4">
          <p>
            Contáctanos para obtener una consulta gratuita.
          </p>
          <a href="/form" className="nav-link" style={{ marginTop: '10px' }}>
            <Button className="cta-button btn-danger">Contáctanos</Button>
          </a>
        </section>
      </Container>
    </>
  );
}

export default Login;
