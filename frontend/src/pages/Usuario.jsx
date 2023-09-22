import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import HeaderUser from '../components/header/HeaderUser.jsx';
import FooterUser from '../components/footer/FooterUser.jsx';

function Usuario() {
    const [usuarios, setUsuarios] = useState([]); // Cambié el nombre de la variable para que sea más descriptiva
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Extraer el token del localStorage y configurarlo en axios
                const tokenFromLocalStorage = localStorage.getItem('token');
                axios.defaults.headers.common['Authorization'] = `Bearer ${tokenFromLocalStorage}`;

                // Realizar una solicitud GET a la API para obtener la lista de usuarios
                const response = await axios.get('http://localhost:8000/user'); // Cambié la URL a '/user' si esta es la ruta correcta

                // Verificar si la respuesta contiene datos válidos
                if (Array.isArray(response.data)) {
                    setUsuarios(response.data);
                    setError(null); // Limpiar cualquier error anterior
                } else {
                    setError('La respuesta de la API no contiene una lista de usuarios válida.');
                }
            } catch (error) {
                console.error('Error al obtener los datos de la API:', error);
                setError('Hubo un error al cargar los datos. Por favor, inténtalo de nuevo más tarde.'); // Configurar el mensaje de error
            } finally {
                setLoading(false); // Detener la carga después de completar la solicitud (éxito o error)
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <HeaderUser />
            <Container className="my-5" style={{ minHeight: "75vh" }}>
                <h1 className="text-center mb-4">Lista de Usuarios</h1>
                {loading && <p className="text-center">Cargando...</p>}
                {error && <p className="text-danger text-center">{error}</p>}
                <Row>
                    {usuarios.length > 0 ? (
                        usuarios.map((user) => (
                            <Col key={user._id} lg={4} md={6} sm={12} className="mb-4">
                                <Card>
                                    <Card.Body>
                                        <Card.Title className="text-primary">{user.name}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">Creado por: {user.createdBy}</Card.Subtitle>
                                        <Card.Text>
                                            <strong>Username: </strong> {user.username}<br />
                                            <strong>Email: </strong> {user.email}<br />
                                            <strong>Password: </strong> {user.password}<br />
                                            <strong>Name: </strong> {user.name}<br />
                                            <strong>Role: </strong> {user.role}<br />
                                        </Card.Text>
                                        <Button variant="outline-primary" block>Ver Detalles</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p className="text-center">No hay usuarios disponibles.</p>
                    )}
                </Row>
            </Container>
            <FooterUser />
        </>
    );
}

export default Usuario;

