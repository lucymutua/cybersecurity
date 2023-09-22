import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import imagen from '../../../src/imagen/cyber.png';


const Main = () => {
  return (
    <>
     
        <div className="main-container" style={{ background: 'linear-gradient(to bottom, #f5f5f5, #e0e0e0)', minHeight: '75vh' }}>
          <Container fluid className="d-flex flex-column justify-content-center align-items-center p-4">
            <header className="text-center mb-8">
              <h1 className="display-4">My Cyber App</h1>
            </header>

            <div className="image-container">
              <img className="img-fluid" src={imagen} alt="Cyber Security" />
            </div>

            <section className="services text-center my-4">
              <h2>Nuestros Servicios</h2>
              <Row>
                  {[
                    {
                      title: 'Seguridad de Datos',
                      color: 'primary',
                    },
                    {
                      title: 'Monitoreo Continuo',
                      color: 'success',
                    },
                    {
                      title: 'Vulnerabilidades',
                      color: 'warning',
                    },
                  ].map((service, index) => (
                    <Col md={4} className={`service text-${service.color} cursor-pointer`} key={index}>
                      <div className="p-4 border rounded">
                        <h3>{service.title}</h3>
                        {/* Contenido adicional */}
                      </div>
                    </Col>
                  ))}
                </Row>
            </section>

            <section className="cta text-center my-4">
              <p>
                Contáctanos para obtener una consulta gratuita.
              </p>
              <a href="/form" className="nav-link" style={{ marginTop: '10px' }}>
                <Button className="cta-button btn-danger">Contáctanos</Button>
              </a>
            </section>
          </Container>
        </div>
      
    </>
  );
};

export default Main;
