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
        <p>{new Date(data.expiratedDate).toLocaleString()}</p>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item>
        <span>Creado por</span>
        <p>{data.userName}</p>
      </FlexboxGrid.Item>
    </>
  )
}