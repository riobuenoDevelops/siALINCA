import { Col, Grid, Modal, Row } from "rsuite";

import Logo from "../../public/img/logo.png";
import LogoUCAB from "../../public/img/logoucab.png";

import "../../styles/about-modal.less";

const AboutModal = ({ showAboutModal, onCloseAboutModal }) => {
  return (
    <Modal
      className="about-modal"
      backdrop="static"
      show={showAboutModal}
      onHide={onCloseAboutModal}
      size="md"
    >
      <Modal.Header className="text-center">
        <Modal.Title>Acerca de siALINCA</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Grid fluid>
          <Row className="flex-row">
            <Col smHidden md={10} className="image-col">
              <img src={Logo} alt="Logo" className="full-width" />
            </Col>
            <Col smHidden md={14} className="text-black">
              <h3>Sistema de Inventario ALINCA</h3>
              <div className="content-text">
                <p className="version">v1.0.0</p>
                <p>
                  siALINCA es un sistema de inventario creado a medida para la
                  Fundación Aliza Internacional Cielos Abiertos (también
                  conocida como ALINCA).
                </p>
                <br />
                <p>
                  siALINCA maneja todos los insumos, entradas, salidas y
                  reportes de inventario de la Fundación.
                </p>
                <br />
                <p>
                  La aplicación es una contribución de parte de la Universidad
                  Católica Andrés Bello a través del Programa de Servicio
                  Comunitario de la misma.
                </p>
              </div>
            </Col>
          </Row>
        </Grid>
      </Modal.Body>
      <Modal.Footer className="footer">
        <Grid fluid>
          <Row className="flex-row">
            <Col xs={20}>
              <p>
                Desarrollado por: <a href="#">Tania Gutierrez</a> &{" "}
                <a href="#">Luis Saavedra</a>
              </p>
            </Col>
            <Col xs={4} style={{ textAlign: "right" }}>
              <img src={LogoUCAB} alt="Logo UCAB" />
            </Col>
          </Row>
        </Grid>
      </Modal.Footer>
    </Modal>
  );
};

export default AboutModal;
