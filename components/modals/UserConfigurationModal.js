import { Button, FlexboxGrid, Input, Modal } from 'rsuite';
import { useForm } from 'react-hook-form';

import AxiosService from '../../services/Axios';
import Routes from '../../config/routes';
import { useCurrentUser } from "../../hooks";

export default function UserConfigurationModal({ isOpen, onClose, user }) {
  const { handleSubmit, register } = useForm();
  const { removeCookie, setCookie } = useCurrentUser();

  const onSave = async (data) => {

    const userInfo = {
      config: {
        nivelInventario: data.nivelInventario
      }
    }

    try{
      await AxiosService.instance.put(`${Routes.getUsers}/${user.user._id}`, userInfo, {
        headers: {
          Authorization: user.token
        }
      });

      const nextDay = 0.33;
      const auxDate = new Date();

      removeCookie("sialincaUser");
      setCookie("sialincaUser", JSON.stringify({
        ...user,
        user: {
          ...user.user,
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
          <span className="input-title">Alerta de Nivel de Inventario</span>
          <Input
            defaultValue={user?.user?.userConfig?.nivelInventario}
            inputRef={register(({ required: true, setValueAs: (value) => parseInt(value) }))}
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
            >
              Guardar
            </Button>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Modal.Footer>
    </Modal>
  );
}