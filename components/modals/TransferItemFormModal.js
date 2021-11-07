import { useForm, Controller } from "react-hook-form";
import {useState} from "react";
import {Button, FlexboxGrid, Input, InputGroup, Modal, SelectPicker} from "rsuite";
import CancelConfirmationModal from "./CancelConfirmationModal";

export default function TransferItemFormModal({
  isOpen,
  handleOpen,
  stores,
  store,
  storeItems,
  onSubmit,
  storeId,
  loading
}) {
  const { handleSubmit, control, register } = useForm();
  const [selectedItemQuantity, setQuantity] = useState(0);
  const [confirmationModalOpen, handleConfirmationModal] = useState(false);

  const onConfirmationHide = () => {
    handleConfirmationModal(false);
  };

  const onExit = () => {
    handleConfirmationModal(true);
  };

  const onCancel = () => {
    handleConfirmationModal(false);
    handleOpen(false);
  };

  return (
    <>
      <Modal className="form-modal" size="md" overflow={true} show={isOpen}>
        <Modal.Title>
          <span className="text-black text-bold">
            Transferir Item
          </span>
        </Modal.Title>
        <Modal.Body>
          <form className="form">
            <div style={{ marginBottom: "1.5rem" }}>
              <span className="input-title">Item</span>
              <Controller
                name="itemId"
                control={control}
                rules={{ require: true }}
                render={(field) => (
                  <SelectPicker
                    {...field}
                    className="select-dropdown"
                    data={storeItems}
                    onSelect={(value) => {
                      console.log(storeItems);
                      setQuantity(store.items[store.items.findIndex(item => item.itemId === value)].quantity);
                    }}
                    placeholder="Seleccione Item"
                    cleanable={false}
                    labelKey="name"
                    valueKey="_id"
                  />
                )}
              />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <span className="input-title">Almacén de origen</span>
              <Controller
                name="originStoreId"
                control={control}
                defaultValue={storeId}
                rules={{ require: true }}
                render={(field) => (
                  <SelectPicker
                    {...field}
                    disabled
                    className="select-dropdown"
                    data={stores}
                    placeholder="Seleccione Almacen"
                    cleanable={false}
                    labelKey="name"
                    valueKey="_id"
                  />
                )}
              />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <span className="input-title">Almacén de destino</span>
              <Controller
                name="destinationStoreId"
                control={control}
                rules={{ require: true }}
                render={(field) => (
                  <SelectPicker
                    {...field}
                    className="select-dropdown"
                    data={stores.filter(store => store._id !== storeId)}
                    placeholder="Seleccione Almacen"
                    cleanable={false}
                    labelKey="name"
                    valueKey="_id"
                  />
                )}
              />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <span className="input-title">Cantidad a Transferir</span>
              <InputGroup>
                <Input
                  name="quantity"
                  min={0}
                  max={selectedItemQuantity}
                  type="number"
                  size="lg"
                  disabled={selectedItemQuantity === 0}
                  inputRef={register({
                    required: true,
                    setValueAs: (v) => parseInt(v),
                    validate: (value) => value > 0
                  })}
                />
                <InputGroup.Addon>{selectedItemQuantity}</InputGroup.Addon>
              </InputGroup>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <FlexboxGrid>
            <FlexboxGrid.Item colspan={13} />
            <FlexboxGrid.Item colspan={4}>
              <Button
                appearance="default"
                className="button shadow text-medium text-black"
                block
                onClick={onExit}
              >
                Cancelar
              </Button>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={1} />
            <FlexboxGrid.Item colspan={6}>
              <Button
                appearance="primary"
                className="button shadow bg-color-primary text-medium text-white"
                block
                onClick={handleSubmit(onSubmit)}
                loading={loading}
              >
                Transferir Items
              </Button>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Modal.Footer>
      </Modal>
      <CancelConfirmationModal
        isOpen={confirmationModalOpen}
        handleOpen={handleConfirmationModal}
        onHandleCloseConfirmationModal={onCancel}
        onHide={onConfirmationHide}
      />
    </>
  )

};