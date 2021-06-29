import {useItems, useStores} from "../../hooks";
import {FlexboxGrid, Modal} from "rsuite";

export default function DeliveryNoteDetailModal({ noteData, applicants, token, isOpen, onHide }) {
  const { stores, isLoading: storesLoading } = useStores(token);
  const { items, isLoading: itemsLoading } = useItems(token);

  return (
    <Modal
      loading={storesLoading || itemsLoading}
      show={isOpen}
      onHide={onHide}
    >
      <Modal.Header>
        <Modal.Title>
          <h4 className="text-bolder">{`Nota de Entrega ${noteData._id}`}</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FlexboxGrid justify="space-between">
          <FlexboxGrid.Item colspan={12}>
            <span className="text-bolder text-black">Fecha de Salida</span>
            <span className="text-bolder text-black">Fecha de Salida</span>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Modal.Body>
    </Modal>
  );
}