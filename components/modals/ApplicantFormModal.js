import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  FlexboxGrid,
  Icon,
  Input,
  InputGroup,
  Modal,
  SelectPicker,
} from "rsuite";
import { useTranslation } from "react-i18next";

import CancelConfirmationModal from "./CancelConfirmationModal";

import "../../styles/forms.less";

const ApplicantFormModal = ({
  isOpen,
  handleOpen,
  onSubmit,
  applicantLoading,
  isUpdateApplicant,
  selectedApplicant,
}) => {
  const { handleSubmit, errors, register, control, reset } = useForm();
  const { i18n } = useTranslation();
  const [confirmationModalOpen, handleCOnfirmationModal] = useState(false);

  const handleIsClose = () => {
    handleOpen(false);
  };

  const onHandleOpenConfirmationModal = () => {
    handleCOnfirmationModal(true);
  };

  const onHandleCloseConfirmationModal = () => {
    handleCOnfirmationModal(false);
    reset();
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
            <h4 className="text-black text-bolder">
              {isUpdateApplicant ? "Actualizar" : "Nuevo"} Solicitante
            </h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <FlexboxGrid>
              <FlexboxGrid.Item colspan={24} style={{ marginBottom: "1em" }}>
                <span className="text-black text-bolder input-title">
                  Nombres
                </span>
                <Controller
                  name="names"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={
                    !isUpdateApplicant ? "" : selectedApplicant.names
                  }
                  render={(field) => (
                    <Input {...field} size="lg" placeholder="Miguel" />
                  )}
                />
                <div
                  style={{
                    color: "Red",
                    display:
                      errors.names?.type === "required" ? "initial" : "none",
                  }}
                >
                  El campo es requerido
                </div>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={24} style={{ marginBottom: "1em" }}>
                <span className="text-black text-bolder input-title">
                  Apellidos
                </span>
                <Controller
                  name="lastNames"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={
                    !isUpdateApplicant ? "" : selectedApplicant.lastNames
                  }
                  render={(field) => (
                    <Input {...field} size="lg" placeholder="Fernandez" />
                  )}
                />
                <div
                  style={{
                    color: "Red",
                    display:
                      errors.lastNames?.type === "required"
                        ? "initial"
                        : "none",
                  }}
                >
                  El campo es requerido
                </div>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={24} style={{ marginBottom: "1em" }}>
                <span className="text-black text-bolder input-title">
                  Cédula
                </span>
                <Controller
                  name="cedula"
                  control={control}
                  rules={{
                    required: true,
                  }}
                  defaultValue={
                    !isUpdateApplicant ? "" : selectedApplicant.cedula
                  }
                  render={(field) => (
                    <Input {...field} size="lg" placeholder="123456789" />
                  )}
                />
                <div
                  style={{
                    color: "Red",
                    display:
                      errors.email?.type === "required" ? "initial" : "none",
                  }}
                >
                  El campo es requerido
                </div>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <FlexboxGrid>
            <FlexboxGrid.Item colspan={isUpdateApplicant ? 12 : 13} />
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
            <FlexboxGrid.Item colspan={isUpdateApplicant ? 7 : 6}>
              <Button
                block
                appearance="primary"
                className="button bg-color-primary text-bold shadow"
                onClick={handleSubmit(onSubmit)}
                loading={applicantLoading}
              >
                {isUpdateApplicant
                  ? "Actualizar Solicitante"
                  : "Crear Solicitante"}
              </Button>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Modal.Footer>
      </Modal>
      <CancelConfirmationModal
        onHandleCloseConfirmationModal={onHandleCloseConfirmationModal}
        handleOpen={onHandleOpenConfirmationModal}
        isOpen={confirmationModalOpen}
        onHide={onHandleCloseConfirmationModal}
      />
    </>
  );
};

module.exports = ApplicantFormModal;
