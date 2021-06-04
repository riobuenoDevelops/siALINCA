import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, FlexboxGrid, Input, Modal, SelectPicker } from "rsuite";
import Crc from "country-state-city";

import "../../styles/forms.less";

const StoreFormModal = ({
  isOpen,
  handleOpen,
  onSubmit,
  newStoreLoading,
  isUpdateStore,
  selectedStore,
}) => {
  const { handleSubmit, errors, register, control } = useForm();
  const { i18n } = useTranslation();
  const [confirmationModalOpen, handleCOnfirmationModal] = useState(false);
  const [selectedCountry, setCountry] = useState(
    selectedStore?.addressCountry || ""
  );
  const [selectedState, setState] = useState(selectedStore?.addressState || "");

  const onHandleOpenConfirmationModal = () => {
    handleCOnfirmationModal(true);
  };

  const handleIsClose = () => {
    handleOpen(false);
  };

  const onHandleCloseConfirmationModal = () => {
    handleCOnfirmationModal(false);
    handleIsClose();
  };

  return (
    <>
      <Modal
        overflow={true}
        show={isOpen}
        onHide={onHandleOpenConfirmationModal}
        className="form form-modal"
      >
        <Modal.Header>
          <Modal.Title>
            <h4 className="text-black text-bolder">{isUpdateStore ? "Actualizar Almacén" : "Nuevo Almacén"}</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FlexboxGrid className="form">
            <FlexboxGrid.Item colspan={24} style={{ marginBottom: "1em" }}>
              <span className="input-title">Nombre del Almacén</span>
              <Controller
                name="name"
                control={control}
                rules={{ required: true }}
                defaultValue={isUpdateStore ? selectedStore.name : ""}
                render={(field) => (
                  <Input {...field} size="lg" placeholder="Principal" />
                )}
              />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={24} style={{ marginBottom: "1em" }}>
              <span className="input-title">Dirección</span>
              <Controller
                name="addressLine"
                control={control}
                rules={{ required: true }}
                defaultValue={isUpdateStore ? selectedStore.addressLine : ""}
                render={(field) => (
                  <Input
                    {...field}
                    size="lg"
                    placeholder="Av. Upata, Casa #14..."
                  />
                )}
              />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={24} style={{ marginBottom: "1em" }}>
              <FlexboxGrid>
                <FlexboxGrid.Item colspan={11}>
                  <span className="input-title">País</span>
                  <Controller
                    name="addressCountry"
                    control={control}
                    defaultValue={
                      isUpdateStore ? selectedStore.addressCountry : ""
                    }
                    rules={{ required: true }}
                    render={(field) => (
                      <SelectPicker
                        {...field}
                        cleanable={false}
                        placement="autoVerticalStart"
                        className="select-dropdown"
                        data={Crc.getAllCountries()}
                        labelKey="name"
                        valueKey="isoCode"
                        onSelect={(value, item) => {
                          setCountry(value);
                        }}
                      />
                    )}
                  />
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={1} />
                <FlexboxGrid.Item colspan={12}>
                  <span className="input-title">Estado</span>
                  <Controller
                    name="addressState"
                    control={control}
                    defaultValue={
                      isUpdateStore ? selectedStore.addressState : ""
                    }
                    rules={{ required: true }}
                    render={(field) => (
                      <SelectPicker
                        {...field}
                        cleanable={false}
                        placement="autoVerticalStart"
                        className="select-dropdown"
                        data={Crc.getStatesOfCountry(selectedCountry)}
                        labelKey="name"
                        valueKey="isoCode"
                        onSelect={(value, item) => {
                          setState(value);
                        }}
                      />
                    )}
                  />
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={24}>
              <FlexboxGrid>
                <FlexboxGrid.Item colspan={11}>
                  <span className="input-title">Ciudad</span>
                  <Controller
                    name="addressCity"
                    control={control}
                    defaultValue={
                      isUpdateStore ? selectedStore?.addressCity : ""
                    }
                    rules={{ required: true }}
                    render={(field) => {
                      return (
                        <SelectPicker
                          {...field}
                          cleanable={false}
                          searchable={false}
                          placement="autoVerticalStart"
                          className="select-dropdown"
                          data={Crc.getCitiesOfState(
                            selectedCountry,
                            selectedState
                          )}
                          labelKey="name"
                          valueKey="name"
                        />
                      );
                    }}
                  />
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={1} />
                <FlexboxGrid.Item colspan={12}>
                  <span className="input-title">Código Postal</span>
                  <Controller
                    name="addressZipcode"
                    control={control}
                    rules={{ required: true }}
                    defaultValue={
                      isUpdateStore ? selectedStore.addressZipcode : ""
                    }
                    render={(field) => (
                      <Input {...field} size="lg" placeholder="8050" />
                    )}
                  />
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Modal.Body>
        <Modal.Footer>
          <FlexboxGrid>
            <FlexboxGrid.Item colspan={isUpdateStore ? 12 : 13} />
            <FlexboxGrid.Item colspan={4}>
              <Button
                block
                onClick={onHandleOpenConfirmationModal}
                className="button shadow bg-color-white text-medium text-black"
              >
                Cancelar
              </Button>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={1} />
            <FlexboxGrid.Item colspan={isUpdateStore ? 7 : 6}>
              <Button
                block
                appearance="primary"
                className="button bg-color-primary text-bold shadow"
                onClick={handleSubmit(onSubmit)}
                loading={newStoreLoading}
              >
                {isUpdateStore ? "Actualizar Almacén" : "Crear Almacén"}
              </Button>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Modal.Footer>
      </Modal>
      <Modal
        className="form form-modal"
        show={confirmationModalOpen}
        onHide={() => handleCOnfirmationModal(false)}
      >
        <Modal.Header>
          <Modal.Title>
            <h5 className="text-black text-bold">Confirmación</h5>
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
                className="button shadow"
              >
                Descartar cambios
              </Button>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={1} />
            <FlexboxGrid.Item colspan={6}>
              <Button
                block
                appearance="default"
                className="button text-medium text-black shadow bg-color-white"
                loading={newStoreLoading}
                onClick={() => handleCOnfirmationModal(false)}
              >
                Seguir editando
              </Button>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default StoreFormModal;
