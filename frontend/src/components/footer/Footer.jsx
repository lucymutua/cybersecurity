import React from 'react';
import { Container,  } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer bg-info text-dark py-3">
      <Container>
        <div className="footer-content">
        </div>
        <div className="footer-info mt-5 text-center">
          <p className="mb-0">&copy; {new Date().getFullYear()} Cyber App. Todos los derechos reservados.</p>
          <p>Email: <a href="mailto:info@cyberApp.com" className="nav-link">info@cyberApp.com</a></p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
