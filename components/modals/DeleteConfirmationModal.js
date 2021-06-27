import { Button, FlexboxGrid, Modal } from "rsuite";

export default function DeleteConfirmationModal({isOpen, onDelete, handleOpen}) {
  return <Modal show={isOpen} onHide={() => handleOpen(false)} className="form form-modal">
    <Modal.Header>
      <Modal.Title>
        <span className="text-black text-bold">Confirmación</span>
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p className="text-black text-bold">
        ¿Está seguro que desea elminar este elemento?
      </p>
      <p>Los datos se perderán</p>
    </Modal.Body>
    <Modal.Footer>
      <FlexboxGrid>
        <FlexboxGrid.Item colspan={10} />
        <FlexboxGrid.Item colspan={7}>
          <Button
            color="red"
            block
            onClick={() => handleOpen(false)}
            className="button shadow text-medium text-black"
          >
            Cancelar
          </Button>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={1} />
        <FlexboxGrid.Item colspan={6}>
          <Button
            block
            appearance="default"
            className="button text-medium text-black bg-color-white shadow"
            onClick={onDelete}
          >
            Eliminar
          </Button>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </Modal.Footer>
  </Modal>
}