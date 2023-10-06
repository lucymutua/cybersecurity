import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';

function Usuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Nuevo estado para los campos de edición
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedRole, setEditedRole] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Extraer el token del localStorage y configurarlo en axios
        const tokenFromLocalStorage = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokenFromLocalStorage}`;

        // Realizar una solicitud GET a la API para obtener la lista de usuarios
        const response = await axios.get("http://localhost:8000/user");

        // Verificar el código de estado HTTP
        if (response.status === 200) {
          // Verificar si la respuesta contiene datos válidos
          if (Array.isArray(response.data)) {
            setUsuarios(response.data);
            setError(null); // Limpiar cualquier error anterior
          } else {
            setError('La respuesta de la API no contiene una lista de usuarios válida.');
          }
        } else {
          setError('Error al obtener los datos de la API: Código de estado ' + response.status);
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

  // Función para mostrar el modal de edición
  const handleShowEditModal = (user) => {
    setUserToEdit(user);
    // Puedes cargar los datos actuales del usuario en los estados de edición aquí
    setEditedName(user.name);
    setEditedEmail(user.email);
    setEditedRole(user.role);
    setShowEditModal(true);
  };

  // Función para ocultar el modal de edición
  const handleCloseEditModal = () => {
    setUserToEdit(null);
    setShowEditModal(false);
  };

  // Función para manejar la edición del usuario
  const handleEditUser = async () => {
    try {
      // Realizar una solicitud PUT o POST a la API para editar el usuario
      const updatedUser = {
        name: editedName,
        email: editedEmail,
        role: editedRole,
      };

      // Envía la solicitud PUT o POST a la API con los datos actualizados
      await axios.put(`http://localhost:8000/user/${userToEdit._id}`, updatedUser);

      // Actualiza la lista de usuarios después de la edición
      const updatedUserList = usuarios.map((user) => {
        if (user._id === userToEdit._id) {
          return { ...user, ...updatedUser };
        }
        return user;
      });
      setUsuarios(updatedUserList);

      // Oculta el modal de edición
      handleCloseEditModal();
    } catch (error) {
      console.error('Error al editar el usuario:', error);
    }
  };

  // Función para mostrar el modal de confirmación de eliminación
  const handleShowDeleteModal = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  // Función para ocultar el modal de confirmación de eliminación
  const handleCloseDeleteModal = () => {
    setUserToDelete(null);
    setShowDeleteModal(false);
  };

  // Función para eliminar el usuario
  const handleDeleteUser = async () => {
    try {
      // Realizar una solicitud DELETE a la API para eliminar el usuario
      await axios.delete(`http://localhost:8000/user/${userToDelete}`);

      // Actualizar la lista de usuarios después de la eliminación
      const updatedUserList = usuarios.filter((user) => user._id !== userToDelete);
      setUsuarios(updatedUserList);

      // Ocultar el modal de confirmación de eliminación
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  return (
    <>
      <Header />
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
                      <strong>Name: </strong> {user.name}<br />
                      <strong>Role: </strong> {user.role}<br />
                    </Card.Text>
                    <Button variant="outline-primary" block onClick={() => handleShowEditModal(user)}>Editar</Button>
                    <Button variant="outline-danger" block onClick={() => handleShowDeleteModal(user._id)}>Eliminar</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-center">No hay usuarios disponibles.</p>
          )}
        </Row>
      </Container>
      <Footer />

      {/* Modal de edición */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formRole">
              <Form.Label>Rol</Form.Label>
              <Form.Control
                type="text"
                value={editedRole}
                onChange={(e) => setEditedRole(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleEditUser}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar este usuario?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Usuario;



