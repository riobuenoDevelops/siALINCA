import { Icon, IconButton, Tooltip, Whisper } from "rsuite";

const BasicActionsButtonGroup = ({disabled, onEdit, onEnableDisable, onDelete}) => {
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

export default BasicActionsButtonGroup;