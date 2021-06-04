import { Button, FlexboxGrid, Modal } from "rsuite";

const CancelConfirmationModal = ({isOpen, onHide, onHandleCloseConfirmationModal, handleOpen}) => {
  return <Modal show={isOpen} onHide={onHide} className="form form-modal">
    <Modal.Header>
      <Modal.Title>
        <span className="text-black text-bold">Confirmación</span>
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p className="text-black text-bold">
        ¿Está seguro que desea cancelar?
      </p>
      <p>Los datos introducidos se perderán</p>
    </Modal.Body>
    <Modal.Footer>
      <FlexboxGrid>
        <FlexboxGrid.Item colspan={10} />
        <FlexboxGrid.Item colspan={7}>
          <Button
            color="red"
            block
            onClick={onHandleCloseConfirmationModal}
            className="button shadow text-medium text-black"
          >
            Descartar cambios
          </Button>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={1} />
        <FlexboxGrid.Item colspan={6}>
          <Button
            block
            appearance="default"
            className="button text-medium text-black bg-color-white shadow"
            onClick={() => handleOpen(false)}
          >
            Seguir editando
          </Button>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </Modal.Footer>
  </Modal>
}

export default CancelConfirmationModal;