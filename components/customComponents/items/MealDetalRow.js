import {FlexboxGrid} from "rsuite";

export default function MealDetailRow({ data }) {
  return (
    <>
      <FlexboxGrid.Item style={{ marginRight: "1rem" }}>
        <span>Presentación</span>
        <p>{data.presentation}</p>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item style={{ marginRight: "1rem" }}>
        <span>Contenido</span>
        <p>{data.content}</p>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item style={{ marginRight: "1rem" }}>
        <span>Fecha de Vencimiento</span>
        <p>{new Intl.DateTimeFormat('es',{month:'2-digit',day:'2-digit', year:'numeric'}).format(new Date(data.expiratedDate))}</p>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item>
        <span>Creado por</span>
        <p>{data.userName}</p>
      </FlexboxGrid.Item>
    </>
  )
}