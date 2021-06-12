import { useState } from "react";
import { FlexboxGrid, Input, SelectPicker } from "rsuite";
import { Controller, useForm } from "react-hook-form";

import FormDropdownFooter from "./common/FormDropdownFooter";
import StoreItemForm from "./common/StoreItemForm";

import currencyData from "../../public/staticData/Common-Currency.json";

import "../../styles/forms.less";

export default function NewEnamelwareForm({
  token,
  stores,
  materialsData,
  sizes,
  errors,
  register,
  control,
  storeItemData,
  quantityData
}) {
  const storeForm = useForm();
  const [isAddingMaterial, handleAddingMaterial] = useState(false);
  const [isAddingSize, handleAddingSize] = useState(false);
  const errorMessage = useState('');

  return (
    <FlexboxGrid justify="space-between" className="form">
      <FlexboxGrid.Item colspan={8}>
        <span className="text-black text-bold input-title">Nombre</span>
        <Input
          size="lg"
          placeholder="Tenedor"
          name="name"
          inputRef={register({ required: true })}
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={7}>
        <span className="input-title">Tamaño</span>
        <FlexboxGrid justify="space-between" align="middle">
          <FlexboxGrid.Item colspan={5}>
            <Input
              size="lg"
              placeholder="0"
              name="size1Number"
              type="number"
              inputRef={register({ required: true })}
            />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={5}>
            <Controller
              name="size1Measure"
              control={control}
              rules={{ required: true }}
              render={(field) => (
                <SelectPicker
                  {...field}
                  className="select-dropdown"
                  data={sizes}
                  searchable={false}
                  cleanable={false}
                  renderExtraFooter={() => {
                    return (
                      <div style={{ padding: "0.5em", width: "100%" }}>
                        <FormDropdownFooter
                          isEditing={isAddingSize}
                          setEditing={handleAddingSize}
                          placeholder="Tamaño"
                          route="enamelware/sizes"
                          token={token}
                        />
                      </div>
                    );
                  }}
                />
              )}
            />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={1} className="text-center text-bold">
            <span>x</span>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={5}>
            <Input
              size="lg"
              placeholder="0"
              name="size2Number"
              type="number"
              inputRef={register()}
            />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={5}>
            <Controller
              name="size2Measure"
              control={control}
              render={(field) => (
                <SelectPicker
                  {...field}
                  className="select-dropdown"
                  data={sizes}
                  searchable={false}
                  cleanable={false}
                  renderExtraFooter={() => {
                    return (
                      <div style={{ padding: "0.5em", width: "100%" }}>
                        <FormDropdownFooter
                          isEditing={isAddingSize}
                          setEditing={handleAddingSize}
                          placeholder="Tamaño"
                          route="enamelware/sizes"
                          token={token}
                        />
                      </div>
                    );
                  }}
                />
              )}
            />
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={7}>
        <span className="input-title">Material</span>
        <Controller
          name="material"
          control={control}
          rules={{ required: true }}
          render={(field) => (
            <SelectPicker
              {...field}
              className="select-dropdown"
              data={materialsData}
              searchable={false}
              cleanable={false}
              renderExtraFooter={() => {
                return (
                  <div style={{ padding: "0.5em", width: "100%" }}>
                    <FormDropdownFooter
                      isEditing={isAddingMaterial}
                      setEditing={handleAddingMaterial}
                      placeholder="Material"
                      route="enamelware/materials"
                      token={token}
                    />
                  </div>
                );
              }}
            />
          )}
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={8} style={{ marginTop: ".5rem" }}>
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
      <FlexboxGrid.Item colspan={7} style={{ marginTop: ".5rem" }}>
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
          onChange={(value) => quantityData[1](parseInt(value))}
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={7} style={{ marginTop: ".5rem" }}>
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
        stores={stores}
        storeData={storeItemData}
        quantityData={quantityData}
        errorMessageData={errorMessage}
        storeForm={storeForm}
      />
    </FlexboxGrid>
  );
}
