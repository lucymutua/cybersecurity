import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import ReCAPTCHA from "react-google-recaptcha";

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
  const [recaptchaValue, setRecaptchaValue] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!recaptchaValue) {
      setAlert({ type: 'error', message: 'Por favor, completa reCAPTCHA.' });
      setIsLoading(false);
      return;
    }

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
        navigate("/usuario");
      } else {
        setAlert({
          type: "error",
          message: "Error al registrar el usuario",
        });
      }
    } catch (error) {
      if (error.response) {
        setAlert({
          type: "error",
          message: error.response.data.message || "Error desconocido",
        });
      } else if (error.request) {
        console.error("No se recibió respuesta del servidor:", error.request);
        setAlert({
          type: "error",
          message:
            "Error de red. Por favor, inténtalo de nuevo más tarde.",
        });
      } else {
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

  // Función para verificar reCAPTCHA
  function verifyRecaptcha(recaptchaResponse) {
    // Establece el valor de reCAPTCHA cuando se completa con éxito
    setRecaptchaValue(recaptchaResponse);
  }

  return (
    <>
      <Header />
      <Container style={{ minHeight: "75vh", marginTop: "40px" }}>
        <Row className="justify-content-center">
          <Col md={6}>
            <Card>
              <Card.Body>
                <h2>Registro de Usuario</h2>
                {isLoading && <p className="text-center">Cargando...</p>}
                {alert.type && (
                  <Alert variant={alert.type}>{alert.message}</Alert>
                )}
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formUsername">
                    <Form.Label>Nombre de Usuario</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={userData.username}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formPassword">
                    <Form.Label>Contraseña</Form.Label>
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
                    <Form.Label>Nombre</Form.Label>
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

                  <ReCAPTCHA
                    sitekey="6LeSunUoAAAAAGZPy4Jyqp1OOxLDDzloLNGv-Vo4"
                    onChange={verifyRecaptcha}
                  />
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Registrando..." : "Registrar"}
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

