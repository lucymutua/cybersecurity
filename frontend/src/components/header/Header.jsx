import React from 'react';
import { FaUserLock } from 'react-icons/fa';
import { Navbar, Nav, Container } from 'react-bootstrap';
import imagen from '../../../src/imagen/myapp.png';

const Header = () => {
  return (
    <>

    <Navbar expand="lg" bg="info" variant="info" style={{ minHeight: '85px' }}>
      <Container className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <Navbar.Brand href="/" className="brand-logo" >
            <img style={{marginRight:'30'}}
              src= {imagen}
              alt="Logo de Cyber App"
              width="40"
              height="40"
              className="d-inline-block align-top"
            />
          
          </Navbar.Brand>

          <span className="brand-name">Cyber App</span>
          <Nav className="me-auto">
            <Nav.Link href="/" className="nav-link">
              Inicio
            </Nav.Link>
            <Nav.Link href="/user" className="nav-link">
              Register
            </Nav.Link>
          </Nav>
        </div>
        <Nav>
          <a href="/login" className="login-button nav-link">
            <FaUserLock /> Login
          </a>
        </Nav>
      </Container>
    </Navbar>
   
    </>
  );
};

export default Header;
