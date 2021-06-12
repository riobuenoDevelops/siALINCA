import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FlexboxGrid, Input, SelectPicker } from "rsuite";

import StoreItemForm from "./common/StoreItemForm";
import FormDropdownFooter from "./common/FormDropdownFooter";
import currencyData from "../../public/staticData/Common-Currency.json";

import "../../styles/forms.less";

export default function NewStationaryForm({
  register,
  control,
  errors,
  token,
  stores,
  marks,
  presentations,
  storeData,
  quantityData
}) {
  const storeForm = useForm();
  const [isAddingMark, handleAddingMark] = useState(false);
  const [isAddingPresentation, handleAddingPresentation] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <FlexboxGrid className="form" justify="space-between">
      <FlexboxGrid.Item colspan={8}>
        <span className="text-black text-bold input-title">Nombre</span>
        <Input
          size="lg"
          placeholder="Mueble"
          name="name"
          inputRef={register({ required: true })}
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={7}>
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
                      route="stationary/marks"
                      token={token}
                    />
                  </div>
                );
              }}
            />
          )}
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={7}>
        <span className="input-title">Presentación</span>
        <Controller
          name="presentation"
          control={control}
          rules={{ required: true }}
          render={(field) => (
            <SelectPicker
              {...field}
              className="select-dropdown"
              data={presentations}
              searchable={false}
              cleanable={false}
              renderExtraFooter={() => {
                return (
                  <div style={{ padding: "0.5em", width: "100%" }}>
                    <FormDropdownFooter
                      isEditing={isAddingPresentation}
                      setEditing={handleAddingPresentation}
                      placeholder="Presentación"
                      route="stationary/presentations"
                      token={token}
                    />
                  </div>
                );
              }}
            />
          )}
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={8} style={{ marginTop: "0.5rem" }}>
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
      <FlexboxGrid.Item colspan={7} style={{ marginTop: "0.5rem" }}>
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
      <FlexboxGrid.Item colspan={7} style={{ marginTop: "0.5rem" }}>
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
      <StoreItemForm
        storeForm={storeForm}
        stores={stores}
        storeData={storeData}
        quantityData={quantityData}
        errorMessageData={[errorMessage, setErrorMessage]}
      />
    </FlexboxGrid>
  );
}
