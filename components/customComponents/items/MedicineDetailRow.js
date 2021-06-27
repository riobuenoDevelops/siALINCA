import {FlexboxGrid} from "rsuite";

export default function MedicineDetailRow({ data }) {
  return (
    <>
      <FlexboxGrid.Item style={{ marginRight: "1rem" }}>
        <span>Marca de Laboratorio</span>
        <p>{data.markLab}</p>
      </FlexboxGrid.Item>
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
      <FlexboxGrid.Item style={{ marginRight: "1rem" }}>
        <span>Creado por</span>
        <p>{data.userName}</p>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item>
        <span>Descripción</span>
        <p>{data.description}</p>
      </FlexboxGrid.Item>
    </>
  )
}