import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import HeaderUser from '../components/header/HeaderUser.jsx';
import FooterUser from '../components/footer/FooterUser.jsx';

function List() {
  const [formList, setFormList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Extraer el token del localStorage y configurarlo en authToken
    const tokenFromLocalStorage = localStorage.getItem('token');

    const fetchData = async () => {
      try {
        // Configurar el token en el encabezado de la solicitud Axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokenFromLocalStorage}`;
    
        // Realizar una solicitud GET a la API
        const response = await axios.get('http://localhost:8000/form');
        const data = response.data;
        
        console.log('Datos obtenidos de la API:', data);
    
        setFormList(data);
        setError(null); // Limpiar cualquier error anterior
      } catch (error) {
        console.error('Error al obtener los datos de la API:', error);
        setError('Hubo un error al cargar los datos. Por favor, inténtalo de nuevo más tarde.'); // Configurar el mensaje de error
      }
    };
    
    fetchData();
  }, []);

  return (
    <>
      <HeaderUser />
      <Container className="my-5" style={{ minHeight: "75vh" }}>
        <h1 className="text-center mb-4">Lista de Formularios</h1>
        {error && <p className="text-danger text-center">{error}</p>}
        <Row>
          {Array.isArray(formList) && formList.length > 0 ? (
            formList.map((form) => (
              <Col key={form._id} lg={4} md={6} sm={12} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title className="text-primary">{form.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Creado por: {form.createdBy}</Card.Subtitle>
                    <Card.Text>
                      <strong>Email: </strong> {form.email}<br />
                      <strong>Asunto: </strong> {form.subject}<br />
                      <strong>Mensaje: </strong> {form.message}<br />
                      <strong>Estado: </strong> {form.status}<br />
                    </Card.Text>
                    <Button variant="outline-primary" block>Ver Detalles</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-center">No hay formularios disponibles.</p>
          )}
        </Row>
      </Container>
      <FooterUser />
    </>
  );
}

export default List;

