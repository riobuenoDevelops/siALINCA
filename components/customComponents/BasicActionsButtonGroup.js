import {useRouter} from "next/router";
import { Icon, IconButton, Tooltip, Whisper, Notification } from "rsuite";

import AxiosService from "../../services/Axios";

export default function BasicActionsButtonGroup({disabled, onEdit, onDelete, route, token}) {
  const router = useRouter();

  const onEnableDisable = async () => {
    try {
      await AxiosService.instance.put(route, {
        disabled: !disabled
      }, {
        headers: {
          Authorization: token
        }
      })
      router.push(router.asPath);
    }catch (err) {
      Notification.error({
        title: "Error",
        description: err.response.data,
        duration: 9000,
        placement: "bottomStart"
      })
    }
  }

  return <>
    <Whisper placement="bottom" trigger="hover" speaker={<Tooltip>Editar</Tooltip>}>
      <IconButton size="md" appearence="primary" circle style={{marginRight: "0.5rem"}} className="bg-default" icon={<Icon icon="edit" />} onClick={onEdit} />
    </Whisper>
    <Whisper placement="bottom" trigger="hover" speaker={<Tooltip>{disabled ? "Habilitar" : "Deshabilitar"}</Tooltip>}>
      <IconButton size="md" appearence="primary" circle style={{marginRight: "0.5rem"}} className="bg-default" icon={<Icon icon={disabled ? "circle" : "circle-o"} />} onClick={onEnableDisable} />
    </Whisper>
    <Whisper placement="bottom" trigger="hover" speaker={<Tooltip>Eliminar</Tooltip>}>
      <IconButton size="md" appearence="primary" circle className="bg-default" icon={<Icon icon="trash" />} onClick={onDelete} />
    </Whisper>
  </>
}