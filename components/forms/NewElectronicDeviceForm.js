import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FlexboxGrid, Input, SelectPicker } from "rsuite";

import FormDropdownFooter from "./common/FormDropdownFooter";
import StoreItemForm from "./common/StoreItemForm";
import DeviceCharacteristicsForm from "./DeviceCharacteristicsForm";
import currencyData from "../../public/staticData/Common-Currency.json";

import ".././../styles/forms.less";

export default function NewElectronicDeviceForm({
  register,
  control,
  errors,
  stores,
  token,
  marks,
  types,
  storeData,
  quantityData,
  deviceCharacteristics
}) {
  const storeForm = useForm();
  const characteristicsForm = useForm();
  const [isAddingMark, handleAddingMark] = useState(false);
  const [isAddingType, handleAddingType] = useState(false);
  const errorMessage = useState('');

  return (
    <FlexboxGrid className="form" justify="space-between">
      <FlexboxGrid.Item colspan={5}>
        <span className="text-black text-bold input-title">Nombre</span>
        <Input
          size="lg"
          placeholder="Mueble"
          name="name"
          inputRef={register({ required: true })}
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={5}>
        <span className="input-title">Nro. de Serial</span>
        <Input
          size="lg"
          placeholder="000000000"
          name="serial"
          inputRef={register({ required: true })}
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={5}>
        <span className="input-title">Marca</span>
        <Controller
          name="mark"
          control={control}
          rules={{ required: true }}
          render={(field) => (
            <SelectPicker
              {...field}
              className="select-dropdown"
              data={marks}
              searchable={false}
              cleanable={false}
              renderExtraFooter={() => {
                return (
                  <div style={{ padding: "0.5em", width: "100%" }}>
                    <FormDropdownFooter
                      isEditing={isAddingMark}
                      setEditing={handleAddingMark}
                      placeholder="Marca"
                      route="electro-device/marks"
                      token={token}
                    />
                  </div>
                );
              }}
            />
          )}
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={5}>
        <span className="text-black text-bold input-title">Modelo</span>
        <Input
          size="lg"
          placeholder="King"
          name="model"
          inputRef={register({ required: true })}
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={5} style={{ marginTop: "0.5rem" }}>
        <span className="input-title">Tipo</span>
        <Controller
          name="deviceType"
          control={control}
          rules={{ required: true }}
          render={(field) => (
            <SelectPicker
              {...field}
              className="select-dropdown"
              data={types}
              searchable={false}
              cleanable={false}
              renderExtraFooter={() => {
                return (
                  <div style={{ padding: "0.5em", width: "100%" }}>
                    <FormDropdownFooter
                      isEditing={isAddingType}
                      setEditing={handleAddingType}
                      placeholder="Tipo"
                      route="electro-device/types"
                      token={token}
                    />
                  </div>
                );
              }}
            />
          )}
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={5} style={{ marginTop: "0.5rem" }}>
        <span className="input-title">Precio</span>
        <FlexboxGrid justify="space-between">
          <FlexboxGrid.Item colspan={8}>
            <Controller
              name="priceCurrency"
              defaultValue=""
              control={control}
              rules={{ required: true }}
              render={(field) => (
                <SelectPicker
                  {...field}
                  className="select-dropdown"
                  data={Object.values(currencyData)}
                  cleanable={false}
                  searchable={false}
                  labelKey="code"
                  valueKey="code"
                />
              )}
            />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={15}>
            <Input
              size="lg"
              placeholder="0"
              type="number"
              inputRef={register({
                required: true,
                setValueAs: (v) => parseInt(v),
              })}
              name="price"
            />
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={5} style={{ marginTop: "0.5rem" }}>
        <span className="input-title">Cantidad</span>
        <Input
          size="lg"
          placeholder="0"
          type="number"
          inputRef={register({
            required: true,
            setValueAs: (v) => parseInt(v),
          })}
          name="quantity"
          value={quantityData[0]}
          onChange={(value) => quantityData[1](value)}
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={5} style={{ marginTop: "0.5rem" }}>
        <span className="input-title">Cantidad por unidad</span>
        <Input
          size="lg"
          placeholder="0"
          type="number"
          inputRef={register({
            required: true,
            setValueAs: (v) => parseInt(v),
          })}
          name="unitQuantity"
        />
      </FlexboxGrid.Item>
      <DeviceCharacteristicsForm
        characteristicsForm={characteristicsForm}
        characteristicsData={deviceCharacteristics}
      />
      {errors[0].characteristics &&
        <FlexboxGrid.Item colspan={24} style={{ color: "red", marginTop: "1rem" }}>
          <span>{errors[0].characteristics.message}</span>
        </FlexboxGrid.Item>
      }
      <StoreItemForm
        storeForm={storeForm}
        stores={stores}
        storeData={storeData}
        errorMessageData={errorMessage}
        quantityData={quantityData}
      />
    </FlexboxGrid>
  );
}
