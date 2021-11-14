import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import { FlexboxGrid, Input, SelectPicker } from "rsuite";
import {useRouter} from "next/router";

import StoreItemForm from "./common/StoreItemForm";
import FormDropdownFooter from "./common/FormDropdownFooter";
import FormErrorMessage from "../common/FormErrorMessage";

import {useItem} from "../../hooks";

import currencyData from "../../public/staticData/Common-Currency.json";

import "../../styles/forms.less";

export default function NewStationaryForm({
  mutate,
  register,
  control,
  errors,
  token,
  stores,
  marks,
  presentations,
  storeData,
  item,
  itemStores
}) {
  const history = useRouter();
  const { id } = history.query;
  const quantityData = useState('');
  const [isAddingMark, handleAddingMark] = useState(false);
  const [isAddingPresentation, handleAddingPresentation] = useState(false);

  useEffect(() => {
    if(id && item && itemStores) {
      quantityData[1](item?.quantity || 0);
      storeData[1](
        itemStores.map((itemStore, index) => (
          {
            index,
            storeId: itemStore.storeId,
            store: itemStore.store,
            quantity: itemStore.quantity
          }
        ))
      );
    }
  }, [id]);

  return (
    <FlexboxGrid className="form" justify="space-between">
      <FlexboxGrid.Item colspan={8}>
        <span className="text-black text-bold input-title">Nombre</span>
        <Input
          size="lg"
          placeholder="Resma de hojas blancas"
          defaultValue={item ? item?.name : ""}
          name="name"
          inputRef={register({ required: true })}
        />
        {errors.name && <FormErrorMessage message="El campo es requerido" />}
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={7}>
        <span className="input-title">Marca</span>
        <Controller
          name="mark"
          control={control}
          defaultValue={item ? item?.mark : ""}
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
                      mutate={mutate}
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
        {errors.mark && <FormErrorMessage message="El campo es requerido" />}
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={7}>
        <span className="input-title">Presentación</span>
        <Controller
          name="presentation"
          control={control}
          defaultValue={item ? item?.presentation : ""}
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
                      mutate={mutate}
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
        {errors.presentation && <FormErrorMessage message="El campo es requerido" />}
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={8} style={{ marginTop: "0.5rem" }}>
        <span className="input-title">Precio</span>
        <FlexboxGrid justify="space-between">
          <FlexboxGrid.Item colspan={15}>
            <Input
              size="lg"
              placeholder="0"
              type="number"
              defaultValue={item ? item.price?.split(" ")[1] : ""}
              inputRef={register({
                required: true,
                setValueAs: (v) => parseInt(v),
              })}
              name="priceText"
            />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={8}>
            <Controller
              name="priceCurrency"
              defaultValue={item ? item.price?.split(" ")[0] : ""}
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
          {errors.priceText && <FormErrorMessage message="El campo es requerido" />}
          {errors.priceCurrency && <FormErrorMessage message="El campo es requerido" />}
        </FlexboxGrid>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={7} style={{ marginTop: "0.5rem" }}>
        <span className="input-title">Cantidad</span>
        <Input
          size="lg"
          placeholder="0"
          type="number"
          defaultValue={item ? item.quantity : ""}
          inputRef={register({
            required: true,
            setValueAs: (v) => parseInt(v),
          })}
          name="quantity"
          value={quantityData[0]}
          onChange={(value) => quantityData[1](value)}
        />
        {errors.quantity && <FormErrorMessage message="El campo es requerido" />}
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={7} style={{ marginTop: "0.5rem" }}>
        <span className="input-title">Cantidad por unidad</span>
        <Input
          size="lg"
          placeholder="0"
          type="number"
          defaultValue={item ? item.unitQuantity : ""}
          inputRef={register({
            required: true,
            setValueAs: (v) => parseInt(v),
          })}
          name="unitQuantity"
        />
        {errors.unitQuantity && <FormErrorMessage message="El campo es requerido" />}
      </FlexboxGrid.Item>
      <StoreItemForm
        stores={stores}
        storeData={storeData}
        quantityData={quantityData}
      />
    </FlexboxGrid>
  );
}
