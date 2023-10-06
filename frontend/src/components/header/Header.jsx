import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import imagen from '../../../src/imagen/myapp.png';

const Header = () => {

  // Función para manejar el cierre de sesión
  function handleLogout() {

    localStorage.removeItem('token');

  }

  return (
    <>

      <Navbar expand="lg" bg="info" variant="info" style={{ minHeight: '85px' }}>
        <Container className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Navbar.Brand href="/" className="brand-logo" >
              <img style={{ marginRight: '30' }}
                src={imagen}
                alt="Logo de Cyber App"
                width="40"
                height="40"
                className="d-inline-block align-top"
              />

            </Navbar.Brand>

            <span className="brand-name">Cyber App</span>

          </div>
          <Nav>
            <a href="/user" className="login-button nav-link">
              Register
            </a>
            <a href="/form" className="login-button nav-link">
              Contact
            </a>
            {/* Botón de cierre de sesión con el manejador de eventos */}
            <a href="/" className="login-button nav-link" onClick={handleLogout}>
              Logout
            </a>
          </Nav>
        </Container>
      </Navbar>

    </>
  );
};

export default Header;
