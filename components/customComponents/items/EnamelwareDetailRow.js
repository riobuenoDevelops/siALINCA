import {FlexboxGrid} from "rsuite";

export default function EnamelwareDetailRow({ data }) {
  return (
    <>
      <FlexboxGrid.Item style={{ marginRight: "1rem" }}>
        <span>Tamaño</span>
        <p>{data.size}</p>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item style={{ marginRight: "1rem" }}>
        <span>Material</span>
        <p>{data.material}</p>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item>
        <span>Creado por</span>
        <p>{data.userName}</p>
      </FlexboxGrid.Item>
    </>
  );
}