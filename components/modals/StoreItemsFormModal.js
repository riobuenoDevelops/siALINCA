import { useState } from "react";
import { Button, FlexboxGrid, Input, Modal, SelectPicker } from "rsuite";
import { useForm, Controller } from "react-hook-form";
import CancelConfirmationModal from "./CancelConfirmationModal";
import StoreItemsTable from "../tables/StoreItemsTable";
import AxiosService from "../../services/Axios";
import routes from "../../config/routes";

import "../../styles/forms.less";

const StoreItemsFormModal = ({ isOpen, handleOpen, store, items, token }) => {
  console.log(items);
  const { handleSubmit, control, register } = useForm();
  const [storeItemsData, handleStoreItems] = useState([]);
  const [confirmationModalOpen, handleConfirmationModal] = useState(false);

  const onConfirmationHide = () => {
    handleConfirmationModal(false);
  };

  const onExit = () => {
    handleConfirmationModal(true);
  };

  const onCancel = () => {
    handleConfirmationModal(true);
    handleOpen(false);
  };

  const onAddItem = (data) => {
    handleStoreItems([
      ...storeItemsData,
      {
        ...items.filter((item) => item._id === data.item)[0],
        storeQuantity: data.quantity,
      },
    ]);
  };

  const onAddItemsToStore = async () => {
    if (storeItemsData.length) {
      return;
    }
    try {
      for (let i = 0; i < storeItemsData.length; i++) {
        await AxiosService.instance.post(
          routes.getStores + `/${store._id}/items`,
          storeItemsData.map((item) => ({
            itemId: item._id,
            quantity: item.storeQuantity,
          })),
          {
            headers: {
              Authorization: token,
            },
          }
        );
      }
    } catch (err) {
      console.error(err.response.data.message);
    }
    handleOpen(false);
  };

  return (
    <>
      <Modal className="form-modal" size="md" overflow={true} show={isOpen}>
        <Modal.Title>
          <span className="text-black text-bold">
            Agregar item al almacén {store.name}
          </span>
        </Modal.Title>
        <Modal.Body>
          <FlexboxGrid className="form">
            <FlexboxGrid.Item colspan={9} style={{ marginBottom: "1rem" }}>
              <span className="input-title">Item</span>
              <Controller
                name="item"
                control={control}
                rules={{ required: true }}
                render={(field) => (
                  <SelectPicker
                    {...field}
                    className="select-dropdown"
                    data={items?.filter((item) => {
                      if (
                        !store.items.some(
                          (storeItem) => storeItem.itemId === item._id
                        )
                      ) {
                        return true;
                      }
                      return false;
                    })}
                    placeholder="Item"
                    cleanable={false}
                    labelKey="name"
                    valueKey="_id"
                  />
                )}
              />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={1} />
            <FlexboxGrid.Item colspan={9}>
              <span className="input-title">Cantidad</span>
              <Input
                size="lg"
                name="quantity"
                type="number"
                inputRef={register({ required: true })}
                placeholder={0}
              />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={1} />
            <FlexboxGrid.Item colspan={4} style={{ marginTop: "1.9rem" }}>
              <Button
                className="button shadow bg-color-secundary text-medium text-white"
                block
                onClick={handleSubmit(onAddItem)}
              >
                Agregar
              </Button>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={24}>
              <StoreItemsTable items={storeItemsData} />
            </FlexboxGrid.Item>
          </FlexboxGrid>
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
                onClick={onAddItemsToStore}
              >
                Agregar items
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
  );
};

export default StoreItemsFormModal;
