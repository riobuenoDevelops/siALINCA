import { Button, FlexboxGrid, Input } from "rsuite";
import {useForm} from "react-hook-form";

import NewDeviceCharacteristicsTable from "../tables/NewDeviceCharacteristicsTable";
import FormErrorMessage from "../common/FormErrorMessage";

export default function DeviceCharacteristicsForm({
  characteristicsData,
}) {
  const { register, errors, reset, handleSubmit } = useForm();

  const onAddCharacteristics = (data) => {
    if (characteristicsData[0].some(item => item.name === data.name)) {
      const newArray = characteristicsData[0].map((item) => {
        if (item.name === data.name) {
          return data;
        }
        return item;
      });

      characteristicsData[1](newArray);
    } else {
      characteristicsData[1]([...characteristicsData[0], { name: data.name, value: data.value }]);
    }
    reset({ name: "", value: "" })
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
          inputRef={register({ required: true })}
          size="lg"
          placeholder="RAM"
        />
        {errors.name && <FormErrorMessage message="El campo es requerido" />}
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={6}>
        <span className="input-title">Valor</span>
        <Input
          name="value"
          inputRef={register({ required: true })}
          size="lg"
          placeholder="8GB"
        />
        {errors.value && <FormErrorMessage message="El campo es requerido" />}
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={2}>
        <Button
          style={{ marginTop: "2em" }}
          appearance="primary"
          className="bg-color-secundary shadow button text-white text-medium"
          block
          onClick={handleSubmit(onAddCharacteristics)}
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
