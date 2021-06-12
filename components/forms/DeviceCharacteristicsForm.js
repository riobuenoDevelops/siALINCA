import { Button, FlexboxGrid, Input } from "rsuite";

import NewDeviceCharacteristicsTable from "../tables/NewDeviceCharacteristicsTable";

export default function DeviceCharacteristicsForm({
  characteristicsForm,
  characteristicsData,
}) {

  const onAddCharacteristics = (data) => {
    characteristicsData[1]([...characteristicsData[0], { name: data.name, value: data.value }])
  }

  return (
    <>
      <FlexboxGrid.Item
        colspan={24}
        style={{ marginBottom: "1rem", marginTop: "2rem" }}
      >
        <h4>Características</h4>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={6} style={{ marginBottom: "1rem" }}>
        <span className="input-title">Característica</span>
        <Input
          name="name"
          inputRef={characteristicsForm.register({ required: true })}
          size="lg"
          placeholder="RAM"
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={6}>
        <span className="input-title">Valor</span>
        <Input
          name="value"
          inputRef={characteristicsForm.register({ required: true })}
          size="lg"
          placeholder="8GB"
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={2}>
        <Button
          style={{ marginTop: "2em" }}
          appearance="primary"
          className="bg-color-secundary shadow button text-white text-medium"
          block
          onClick={characteristicsForm.handleSubmit(onAddCharacteristics)}
        >
          Agregar
        </Button>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={7} />
      <FlexboxGrid.Item colspan={24}>
        <NewDeviceCharacteristicsTable
          data={characteristicsData[0]}
          handleData={characteristicsData[1]}
        />
      </FlexboxGrid.Item>
    </>
  );
}
