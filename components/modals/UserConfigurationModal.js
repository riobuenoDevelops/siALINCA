import { useRef, useState } from 'react';
import { Button, FlexboxGrid, Icon, Input, InputGroup, Modal } from 'rsuite';
import { useForm } from 'react-hook-form';

import AxiosService from '../../services/Axios';
import Routes from '../../config/routes';
import { useCurrentUser, useDecrypt, useEncrypt, useUser } from '../../hooks';

export default function UserConfigurationModal({ isOpen, onClose }) {
  const { handleSubmit, register, errors, watch } = useForm();
  const [changePassword, setChangePassword] = useState(false);
  const [actualPassword, setActualPassword] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [showRepeatContent, setShowRepeatContent] = useState(false);
  const [passwordLoadnding, setPasswordLoanding] = useState(false);
  const [userLoanding, setUserLoanding] = useState(false);
  const { removeCookie, setCookie, user: currentUser } = useCurrentUser();
  const { user } = useUser(currentUser?.user?._id, currentUser?.token);
  const password = useRef({});

  password.current = watch("password", "");

  const onChangePassword = async (data) => {
    console.log(user);
    setPasswordLoanding(true);
    if (useDecrypt(user.password) !== actualPassword) {
      setPasswordLoanding(false);
      return;
    }

    try {
      await AxiosService.instance.put(`${Routes.getUsers}/${currentUser.user._id}`,
        { password: data.password }, {
        headers: {
          Authorization: currentUser.token
        }
      });

      setChangePassword(false);
    } catch (err) {
      console.log(err);
    }
    setPasswordLoanding(false);
  }

  const onSave = async (data) => {
    setUserLoanding(true);

    const userInfo = {
      email: data.email,
      names: data.names,
      lastNames: data.lastNames,
      config: {
        nivelInventario: data.nivelInventario
      }
    }

    try{
      await AxiosService.instance.put(`${Routes.getUsers}/${user.user._id}`, userInfo, {
        headers: {
          Authorization: currentUser.token
        }
      });

      const nextDay = 0.33;
      const auxDate = new Date();

      removeCookie("sialincaUser");
      setCookie("sialincaUser", JSON.stringify({
        ...user,
        user: {
          ...user.user,
          email: data.email,
          names: data.names,
          lastNames: data.lastNames,
          userConfig: {
            nivelInventario: data.nivelInventario
          }
        }
      }), {
        expires: new Date(auxDate.getTime() + nextDay * 24 * 60 * 60 * 1000),
      });

      onClose();
    } catch (err) {
      console.log(err);
    }
    setUserLoanding(false);
  };

  return (
    <Modal
      backdrop="static"
      show={isOpen}
      onHide={onClose}
      className="form form-modal"
    >
      <Modal.Header>
        <Modal.Title>Configuración de Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="form">
          <h4 style={{ marginBottom: '1rem' }}>Información General</h4>
          <FlexboxGrid justify="space-between">
            <FlexboxGrid.Item colspan={11}>
              <span className="input-title">Nombres</span>
              <Input
                defaultValue={currentUser?.user?.names}
                inputRef={register()}
                name="names"
              />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={11}>
              <span className="input-title">Apellidos</span>
              <Input
                defaultValue={currentUser?.user?.lastNames}
                inputRef={register()}
                name="lastNames"
              />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={24} className="not-first-row">
              <span className="input-title">Correo Electrónico</span>
              <Input
                defaultValue={currentUser?.user?.email}
                inputRef={register()}
                name="email"
              />
            </FlexboxGrid.Item>
            {changePassword &&
              <>
                <FlexboxGrid.Item colspan={24} className="not-first-row">
                  <span className="input-title">Contraseña actual</span>
                  <Input
                    type="password"
                    value={actualPassword}
                    onChange={setActualPassword}
                  />
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={11} className="not-first-row">
              <span className="input-title">
                  Contraseña
                </span>
                  <InputGroup inside>
                    <Input
                      size="lg"
                      name="password"
                      type={!showContent ? "password" : "text"}
                      inputRef={register()}
                    />
                    <InputGroup.Button
                      style={{
                        height: "100%",
                        width: "4em",
                        justifyContent: "center",
                      }}
                      onClick={() => setShowContent(!showContent)}
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
                <FlexboxGrid.Item colspan={11} className="not-first-row">
              <span className="input-title">
                  Repita Contraseña
                </span>
                  <InputGroup inside>
                    <Input
                      size="lg"
                      name="repeatPassword"
                      type={!showRepeatContent ? "password" : "text"}
                      inputRef={register({
                        validate: (value) =>
                          value === password.current ||
                          "Las contraseñas no coinciden",
                      })}
                    />
                    <InputGroup.Button
                      style={{
                        height: "100%",
                        width: "4em",
                        justifyContent: "center",
                      }}
                      onClick={() => setShowRepeatContent(!showRepeatContent)}
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
              </>
            }
            <FlexboxGrid.Item colspan={24} style={{ display: 'flex', justifyContent: 'end', marginTop: '1rem' }}>
              <Button
                appearance="primary"
                loading={passwordLoadnding}
                className="button shadow"
                onClick={!changePassword ? () => setChangePassword(true) : handleSubmit(onChangePassword)}
              >
                {!changePassword ? "Cambiar contraseña" : "Actualizar Contraseña"}
              </Button>
            </FlexboxGrid.Item>
          </FlexboxGrid>
          <span className="input-title">Alerta de Nivel de Inventario</span>
          <Input
            defaultValue={currentUser?.user?.userConfig?.nivelInventario}
            inputRef={register({ setValueAs: (v) => parseInt(v) })}
            name="nivelInventario"
            type="number"
          />
        </form>
      </Modal.Body>
      <Modal.Footer>
        <FlexboxGrid justify="end">
          <FlexboxGrid.Item colspan={6} style={{ marginRight: "0.5rem" }}>
            <Button
              block
              appearance="default"
              className="button shadow bg-color-white text-medium text-black"
              onClick={onClose}
            >
              Cancelar
            </Button>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={6}>
            <Button
              block
              appearance="primary"
              className="button shadow text-medium bg-color-primary text-white"
              onClick={handleSubmit(onSave)}
              loading={userLoanding}
            >
              Guardar
            </Button>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Modal.Footer>
    </Modal>
  );
}