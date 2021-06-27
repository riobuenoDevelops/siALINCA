import {FlexboxGrid} from "rsuite";

export default function StationaryDetailRow({ data }) {
  return (
    <>
      <FlexboxGrid.Item style={{ marginRight: "1rem" }}>
        <span>Marca</span>
        <p>{data.mark}</p>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item style={{ marginRight: "1rem" }}>
        <span>Presentación</span>
        <p>{data.presentation}</p>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item>
        <span>Creado por</span>
        <p>{data.userName}</p>
      </FlexboxGrid.Item>
    </>
  );
}