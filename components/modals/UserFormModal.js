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

import "../../styles/forms.less";
import CancelConfirmationModal from "./CancelConfirmationModal";

const UserFormModal = ({
  isOpen,
  handleOpen,
  onSubmit,
  newUserLoading,
  roles,
  roleName,
  handleRoleName,
  isUpdateUser,
  selectedUser,
}) => {
  const { handleSubmit, errors, register, watch, control, reset } = useForm();
  const { i18n } = useTranslation();
  const [confirmationModalOpen, handleCOnfirmationModal] = useState(false);
  const [showContent, handleContent] = useState(false);
  const [showRepeatContent, handleRepeatContent] = useState(false);
  const password = useRef({});
  password.current = watch("password", "");

  const onSelectRoleName = (value) => {
    handleRoleName(value);
  };

  const handleIsClose = () => {
    handleOpen(false);
  };

  const onHandleContent = () => {
    handleContent(!showContent);
  };

  const onHandleRepeatContent = () => {
    handleRepeatContent(!showRepeatContent);
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
              {isUpdateUser ? "Actualizar" : "Nuevo"} Usuario
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
                  defaultValue={!isUpdateUser ? "" : selectedUser.names}
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
                  defaultValue={!isUpdateUser ? "" : selectedUser.lastNames}
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
                  Correo Electrónico
                </span>
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: true,
                    pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  }}
                  defaultValue={!isUpdateUser ? "" : selectedUser.email}
                  render={(field) => (
                    <Input
                      {...field}
                      size="lg"
                      placeholder="example@example.com"
                    />
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
                <div
                  style={{
                    color: "Red",
                    display:
                      errors.email?.type === "pattern" ? "initial" : "none",
                  }}
                >
                  Introduzca un correo válido
                </div>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={24} style={{ marginBottom: "1em" }}>
                <span className="text-black text-bolder input-title">
                  Contraseña
                </span>
                <InputGroup inside>
                  <Controller
                    name="password"
                    control={control}
                    rules={{ required: true }}
                    defaultValue=""
                    render={(field) => (
                      <Input
                        {...field}
                        size="lg"
                        placeholder="Contraseña"
                        type={!showContent ? "password" : "text"}
                      />
                    )}
                  />
                  <InputGroup.Button
                    style={{
                      height: "100%",
                      width: "4em",
                      justifyContent: "center",
                    }}
                    onClick={onHandleContent}
                  >
                    <Icon
                      style={{ fontSize: "18px" }}
                      icon={!showContent ? "eye-slash" : "eye"}
                    />
                  </InputGroup.Button>
                </InputGroup>
                <div
                  style={{
                    color: "Red",
                    display:
                      errors.password?.type === "required" ? "initial" : "none",
                  }}
                >
                  El campo es requerido
                </div>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={24} style={{ marginBottom: "1em" }}>
                <span className="text-black text-bolder input-title">
                  Repita Contraseña
                </span>
                <InputGroup inside>
                  <Controller
                    name="repeatPassword"
                    control={control}
                    rules={{
                      required: true,
                      validate: (value) =>
                        value === password.current ||
                        "Las contraseñas no coinciden",
                    }}
                    defaultValue=""
                    render={(field) => (
                      <Input
                        {...field}
                        size="lg"
                        placeholder="Repita Contraseña"
                        type={!showRepeatContent ? "password" : "text"}
                      />
                    )}
                  />
                  <InputGroup.Button
                    style={{
                      height: "100%",
                      width: "4em",
                      justifyContent: "center",
                    }}
                    onClick={onHandleRepeatContent}
                  >
                    <Icon
                      style={{ fontSize: "18px" }}
                      icon={!showRepeatContent ? "eye-slash" : "eye"}
                    />
                  </InputGroup.Button>
                </InputGroup>
                <div
                  style={{
                    color: "Red",
                    display:
                      errors.repeatPassword !== undefined ? "initial" : "none",
                  }}
                >
                  {errors?.repeatPassword?.message}
                </div>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={24} style={{ marginBottom: "1em" }}>
                <span className="text-black text-bolder input-title">
                  Rol de Usuario
                </span>
                <Controller
                  name="roleName"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={!isUpdateUser ? null : roles.filter((role) => role._id === selectedUser.roleId)[0].name}
                  render={(field) => (
                    <SelectPicker
                      {...field}
                      className="select-dropdown"
                      placeholder="Seleccione..."
                      labelKey="name"
                      valueKey="name"
                      data={roles}
                      cleanable={false}
                      searchable={false}
                      renderMenuItem={(label, item) => {
                        return <div>{i18n.t(`roles.${label}`)}</div>;
                      }}
                      renderValue={(value, item) => {
                        return <div>{i18n.t(`roles.${value}`)}</div>;
                      }}
                    />
                  )}
                />
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <FlexboxGrid>
            <FlexboxGrid.Item colspan={isUpdateUser ? 12 : 13} />
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
            <FlexboxGrid.Item colspan={isUpdateUser ? 7 : 6}>
              <Button
                block
                appearance="primary"
                className="button bg-color-primary text-bold shadow"
                onClick={handleSubmit(onSubmit)}
                loading={newUserLoading}
              >
                {isUpdateUser ? "Actualizar Usuario" : "Crear Usuario"}
              </Button>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Modal.Footer>
      </Modal>
      <CancelConfirmationModal isOpen={confirmationModalOpen} onHide={() => handleCOnfirmationModal(false)} onHandleCloseConfirmationModal={onHandleCloseConfirmationModal} handleOpen={handleCOnfirmationModal} />
    </>
  );
};

module.exports = UserFormModal;
