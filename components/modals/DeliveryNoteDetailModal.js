import { FlexboxGrid, Modal } from 'rsuite';

import DeliveryNoteItemsTable from '../tables/DeliveryNoteItemsTable';

import '../../styles/forms.less';

export default function DeliveryNoteDetailModal({ noteData, applicants, isOpen, onHide, stores, items }) {

  const getApplicantName = () => {
    const applicant = applicants.filter(applicant => applicant._id === noteData.applicantId)[0];

    return applicant?.name || applicant?.names;
  };

  return (
    <Modal
      backdrop="static"
      show={isOpen}
      onHide={onHide}
    >
      <Modal.Header>
        <Modal.Title>
          <h4 className="text-bolder">{`Nota de Entrega ${noteData._id}`}</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FlexboxGrid className="full-width form" justify="space-between">
          <FlexboxGrid.Item colspan={24}>
            <span className="input-title">Tipo de Nota</span>
            <span>{noteData.noteType === 'CR' ? 'Con Retorno' : 'Sin Retorno'}</span>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={11} className="not-first-row">
            <span className="input-title">Fecha de Salida</span>
            <span>{new Date(noteData?.createStamp).toLocaleString()}</span>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={11} className="not-first-row">
            <span className="input-title">Fecha de Retorno</span>
            <span>{noteData?.returnStamp ? new Date(noteData?.returnStamp).toLocaleString() : 'N/A'}</span>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={11} className="not-first-row">
            <span className="input-title">Tipo de Solicitante</span>
            <span>{noteData?.applicantType === 'sede' ? 'Sede' : 'Persona Natural'}</span>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={11} className="not-first-row">
            <span className="input-title">Nombre de Solicitante</span>
            <span>{getApplicantName()}</span>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={24} style={{ marginTop: '1rem' }}>
            <h5 style={{ marginBottom: '1rem' }}>Items extraidos</h5>
            <DeliveryNoteItemsTable
              data={noteData?.items ? noteData.items.map(item => (
                {
                  storeName: stores.filter(store => store._id === item.storeId)[0].name,
                  itemName: items.filter(inventoryItem => inventoryItem._id === item.itemId)[0].name,
                  quantity: item.quantity
                }
              )) : []}
              withoutAction />
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Modal.Body>
    </Modal>
  );
}