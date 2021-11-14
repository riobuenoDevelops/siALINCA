import {FlexboxGrid} from "rsuite";

export default function PropertyDetailRow({ data }) {
  return (
    <>
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
      <FlexboxGrid.Item style={{ marginRight: "1rem" }}>
        <span>Creado por</span>
        <p>{data.userName}</p>
      </FlexboxGrid.Item>
      {data.isRealState && (
        <>
          <FlexboxGrid.Item style={{ marginRight: "1rem" }}>
            <span>Dirección</span>
            <p>{data.addressLine}</p>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item style={{ marginRight: "1rem" }}>
            <span>Ciudad</span>
            <p>{data.addressCity}</p>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item style={{ marginRight: "1rem" }}>
            <span>Estado</span>
            <p>{data.addressState}</p>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item style={{ marginRight: "1rem" }}>
            <span>País</span>
            <p>{data.addressCountry}</p>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item style={{ marginRight: "1rem" }}>
            <span>Código Postal</span>
            <p>{data.addressZipcode}</p>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item>
            <span>Descripción</span>
            <p>{data.description}</p>
          </FlexboxGrid.Item>
        </>
      )}
    </>
  );
}