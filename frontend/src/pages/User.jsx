import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

function User() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
    role: "",
  });
  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/user/register", // Asegúrate de que esta URL sea correcta
        userData
      );

      if (response.status === 200) {
        setAlert({
          type: "success",
          message: "Usuario registrado con éxito",
        });
        // Redirige a la página de usuario después de un registro exitoso
        navigate("/usuario");
      } else {
        setAlert({
          type: "error",
          message: "Error al registrar el usuario",
        });
      }
    } catch (error) {
      if (error.response) {
        // Error de respuesta desde el servidor
        setAlert({
          type: "error",
          message: error.response.data.message || "Error desconocido",
        });
      } else if (error.request) {
        // No se recibió respuesta del servidor
        console.error("No se recibió respuesta del servidor:", error.request);
        setAlert({
          type: "error",
          message:
            "Error de red. Por favor, inténtalo de nuevo más tarde.",
        });
      } else {
        // Otros errores
        console.error("Error al configurar la solicitud:", error.message);
        setAlert({
          type: "error",
          message:
            "Error de red. Por favor, inténtalo de nuevo más tarde.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Container style={{ minHeight: "75vh", marginTop: "40px" }}>
        <Row className="justify-content-center">
          <Col md={6}>
            <Card>
              <Card.Body>
                <h2>User Registration</h2>
                {isLoading && <p className="text-center">Cargando...</p>}
                {alert.type && (
                  <Alert variant={alert.type}>{alert.message}</Alert>
                )}
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={userData.username}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={userData.password}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formRole">
                    <Form.Label>Role</Form.Label>
                    <Form.Control
                      type="text"
                      name="role"
                      value={userData.role}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Registrando..." : "Register"}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default User;

