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

import { useDecrypt, useRoles } from "../../hooks/index";

import "../../styles/forms.less";

const UserFormModal = ({
  isOpen,
  handleOpen,
  onSubmit,
  newUserLoading,
  handleRoleName,
  isUpdateUser,
  selectedUser,
  token
}) => {
  const decryptedPassword = useDecrypt(!isUpdateUser ? "" : selectedUser.password);
  const { handleSubmit, errors, register, watch, control, reset } = useForm();
  const { i18n } = useTranslation();
  const [confirmationModalOpen, handleCOnfirmationModal] = useState(false);
  const [showContent, handleContent] = useState(false);
  const [showRepeatContent, handleRepeatContent] = useState(false);
  const password = useRef({});
  const { roles } = useRoles(token);

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
            <span className="text-black text-bolder">
              {isUpdateUser ? "Actualizar" : "Nuevo"} Usuario
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <FlexboxGrid>
              <FlexboxGrid.Item colspan={24} style={{ marginBottom: "1em" }}>
                <span className="input-title">
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
                <span className="input-title">
                  Apellidos
                </span>
                <Input
                  size="lg"
                  placeholder="Fernandez"
                  name="lastNames"
                  inputRef={register({ required: true })}
                  defaultValue={!isUpdateUser ? "" : selectedUser.lastNames}
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
                <span className="input-title">
                  Correo Electrónico
                </span>
                <Input
                  size="lg"
                  placeholder="example@example.com"
                  name="email"
                  inputRef={register({
                    required: true,
                    pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  })}
                  defaultValue={!isUpdateUser ? "" : selectedUser.email}
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
                <span className="input-title">
                  Contraseña
                </span>
                <InputGroup inside>
                  <Input
                    size="lg"
                    placeholder="Contraseña"
                    name="password"
                    type={!showContent ? "password" : "text"}
                    inputRef={register({ required: true })}
                    defaultValue={decryptedPassword}
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
                <span className="input-title">
                  Repita Contraseña
                </span>
                <InputGroup inside>
                  <Input
                    size="lg"
                    name="repeatPassword"
                    placeholder="Repita Contraseña"
                    type={!showRepeatContent ? "password" : "text"}
                    inputRef={register({
                      required: true,
                      validate: (value) =>
                        value === password.current ||
                        "Las contraseñas no coinciden",
                    })}
                    defaultValue=""
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
                <span className="input-title">
                  Rol de Usuario
                </span>
                <Controller
                  name="roleName"
                  control={control}
                  rules={{ required: true }}
                  defaultValue={!isUpdateUser ? null : roles?.filter((role) => role._id === selectedUser.roleId)[0].name}
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
                      renderMenuItem={(label) => {
                        return <div>{i18n.t(`roles.${label}`)}</div>;
                      }}
                      renderValue={(value) => {
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
