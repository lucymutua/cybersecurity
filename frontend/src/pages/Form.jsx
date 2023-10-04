import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from 'react-router-dom';


function ContactForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    subject: '',
    message: '',
  });

  const [alert, setAlert] = useState({
    type: '',
    message: '',
  });

  const [recaptchaValue, setRecaptchaValue] = useState(null); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recaptchaValue) {
      // Mostrar un mensaje de error o realizar alguna acción si reCAPTCHA no se completó.
      setAlert({ type: 'error', message: 'Please complete the reCAPTCHA.' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/form', formData);

      if (response.status === 201) {
        // Reset the form data upon successful submission
        setFormData({
          email: '',
          name: '',
          subject: '',
          message: '',
        });

        // Show a success alert
        setAlert({ type: 'success', message: 'Data sent successfully' });

        navigate("/listforms");
      } else {
        // Show an error alert
        setAlert({ type: 'error', message: 'Error sending data' });
      }
    } catch (error) {
      // Show a network error alert
      setAlert({ type: 'error', message: 'Network error. Please try again later.' });
      console.error('Network error:', error);
    }
  };

  // Función para verificar reCAPTCHA
function verifyRecaptcha(recaptchaResponse) {
  const secretKey = '6LfQnHUoAAAAAPR_i-xJDUr7HmyDhPjhO52XNiai'; // Reemplaza con tu clave secreta de reCAPTCHA
  return axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
    params: {
      secret: secretKey,
      response: recaptchaResponse,
    },
  });
}

  return (
    <>
      <Header />
      <Container style={{ minHeight: '75vh', marginTop: '40px' }}>
        <Row className="justify-content-center">
          <Col md={4}>
            <h2>Contact Us</h2>
            {alert.type && (
              <div className={`alert alert-${alert.type}`} role="alert">
                {alert.message}
              </div>
            )}
            <Form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email:
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="subject" className="form-label">
                  Subject:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  Message:
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  required
                />
              </div>

              <ReCAPTCHA
                sitekey="6LfQnHUoAAAAAB7GMwoV9l9mpp70yWA4q8quA7tW"
                onChange={(value) => setRecaptchaValue(value)}
              />

              <Button type="submit" variant="primary">
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default ContactForm;




