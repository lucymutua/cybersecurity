import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';

function List() {
  const [formList, setFormList] = useState([]);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formToEdit, setFormToEdit] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);


    // Nuevo estado para los campos de edición
    const [editedName, setEditedName] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [editedSubject, setEditedSubject] = useState('');
    const [editedMessage, setEditedMessage] = useState('');

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

    // Función para mostrar el modal de edición
    const handleShowEditModal = (form) => {
      setFormToEdit(form);
      // Puedes cargar los datos actuales del formulario en los estados de edición aquí
      setEditedName(form.name);
      setEditedEmail(form.email);
      setEditedSubject(form.subject);
      setEditedMessage(form.message);
      setShowEditModal(true);
    };
  
    // Función para ocultar el modal de edición
    const handleCloseEditModal = () => {
      setFormToEdit(null);
      setShowEditModal(false);
    };
  
    // Función para manejar la edición del formulario
    const handleEditForm = async () => {
      try {
        // Realizar una solicitud PUT o POST a la API para editar el formulario
        const updatedForm = {
          name: editedName,
          email: editedEmail,
          subject: editedSubject,
          message: editedMessage,
        };
  
        // Envía la solicitud PUT o POST a la API con los datos actualizados
        await axios.put(`http://localhost:8000/form/${formToEdit._id}`, updatedForm);
        
        // Actualiza la lista de formularios después de la edición
        const updatedFormList = formList.map((form) => {
          if (form._id === formToEdit._id) {
            return { ...form, ...updatedForm };
          }
          return form;
        });
        setFormList(updatedFormList);
  
        // Oculta el modal de edición
        handleCloseEditModal();
      } catch (error) {
        console.error('Error al editar el formulario:', error);
      }
    };

  // Función para mostrar el modal de confirmación de eliminación
  const handleShowDeleteModal = (formId) => {
    setFormToDelete(formId);
    setShowDeleteModal(true);
  };

  // Función para ocultar el modal de confirmación de eliminación
  const handleCloseDeleteModal = () => {
    setFormToDelete(null);
    setShowDeleteModal(false);
  };

  // Función para eliminar el formulario
  const handleDeleteForm = async () => {
    try {
      // Realizar una solicitud DELETE a la API para eliminar el formulario
      await axios.delete(`http://localhost:8000/form/${formToDelete}`);

      // Actualizar la lista de formularios después de la eliminación
      const updatedFormList = formList.filter((form) => form._id !== formToDelete);
      setFormList(updatedFormList);

      // Ocultar el modal de confirmación de eliminación
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error al eliminar el formulario:', error);
    }
  };

  return (
    <>
      <Header />
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
                    <Button variant="outline-primary" block onClick={() => handleShowEditModal(form)}>Editar</Button>

                    <Button variant="outline-danger" block onClick={() => handleShowDeleteModal(form._id)}>Eliminar</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-center">No hay formularios disponibles.</p>
          )}
        </Row>
      </Container>
      <Footer />   

      {/* Modal de edición */}
<Modal show={showEditModal} onHide={handleCloseEditModal}>
  <Modal.Header closeButton>
    <Modal.Title>Editar Formulario</Modal.Title>
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
      {/* Agrega campos para editar otros detalles del formulario aquí */}
      <Form.Group controlId="formEmail">
        <Form.Label>Correo Electrónico</Form.Label>
        <Form.Control
          type="email"
          value={editedEmail}
          onChange={(e) => setEditedEmail(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="formSubject">
        <Form.Label>Asunto</Form.Label>
        <Form.Control
          type="text"
          value={editedSubject}
          onChange={(e) => setEditedSubject(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="formMessage">
        <Form.Label>Mensaje</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={editedMessage}
          onChange={(e) => setEditedMessage(e.target.value)}
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseEditModal}>
      Cancelar
    </Button>
    <Button variant="primary" onClick={handleEditForm}>
      Guardar Cambios
    </Button>
  </Modal.Footer>
</Modal>


      {/* Modal de confirmación de eliminación */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar este formulario?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteForm}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default List;




