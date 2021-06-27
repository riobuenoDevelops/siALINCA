import {FlexboxGrid} from "rsuite";

export default function ElectroDeviceDetailRow({ data }) {
  return (
    <>
      <FlexboxGrid.Item style={{ marginRight: "1rem" }}>
        <span>Tipo de Dispositivo</span>
        <p>{data.deviceType}</p>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item style={{ marginRight: "1rem" }}>
        <span>Nro. de Serial</span>
        <p>{data.serial}</p>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item style={{ marginRight: "1rem" }}>
        <span>Marca</span>
        <p>{data.mark}</p>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item style={{ marginRight: "1rem" }}>
        <span>Modelo</span>
        <p>{data.model}</p>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item>
        <span>Creado por</span>
        <p>{data.userName}</p>
      </FlexboxGrid.Item>
    </>
  );
}