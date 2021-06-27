import {useEffect, useState} from "react";
import { Controller, useForm } from "react-hook-form";
import { FlexboxGrid, Input, SelectPicker } from "rsuite";
import {useRouter} from "next/router";

import FormDropdownFooter from "./common/FormDropdownFooter";
import StoreItemForm from "./common/StoreItemForm";
import DeviceCharacteristicsForm from "./DeviceCharacteristicsForm";
import FormErrorMessage from "../common/FormErrorMessage";

import {useItem} from "../../swr";

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
  deviceCharacteristics
}) {
  const history = useRouter();
  const { id } = history.query;
  const quantityData = useState('');
  const [isAddingMark, handleAddingMark] = useState(false);
  const [isAddingType, handleAddingType] = useState(false);
  const { item, itemStores = [] } = useItem(token, id ? id : '');

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
      deviceCharacteristics[1](item.characteristics)
    }
  }, [id]);

  return (
    <FlexboxGrid className="form" justify="space-between">
      <FlexboxGrid.Item colspan={5}>
        <span className="text-black text-bold input-title">Nombre</span>
        <Input
          size="lg"
          placeholder="Laptop"
          defaultValue={item ? item?.name : ""}
          name="name"
          inputRef={register({ required: true })}
        />
        {errors.name && <FormErrorMessage message="El campo es requerido" />}
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={5}>
        <span className="input-title">Nro. de Serial</span>
        <Input
          size="lg"
          placeholder="000000000"
          name="serial"
          defaultValue={item ? item?.serial : ""}
          inputRef={register({ required: true })}
        />
        {errors.serial && <FormErrorMessage message="El campo es requerido" />}
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={5}>
        <span className="input-title">Marca</span>
        <Controller
          name="mark"
          control={control}
          rules={{ required: true }}
          defaultValue={item ? item?.mark : ""}
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
        {errors.mark && <FormErrorMessage message="El campo es requerido" />}
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={5}>
        <span className="text-black text-bold input-title">Modelo</span>
        <Input
          size="lg"
          placeholder="King"
          name="model"
          defaultValue={item ? item?.model : ""}
          inputRef={register({ required: true })}
        />
        {errors.model && <FormErrorMessage message="El campo es requerido" />}
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={5} style={{ marginTop: "0.5rem" }}>
        <span className="input-title">Tipo</span>
        <Controller
          name="deviceType"
          control={control}
          defaultValue={item ? item?.deviceType : ""}
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
        {errors.deviceType && <FormErrorMessage message="El campo es requerido" />}
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={5} style={{ marginTop: "0.5rem" }}>
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
              control={control}
              defaultValue={item ? item.price?.split(" ")[0] : ""}
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
      <FlexboxGrid.Item colspan={5} style={{ marginTop: "0.5rem" }}>
        <span className="input-title">Cantidad</span>
        <Input
          size="lg"
          placeholder="0"
          type="number"
          defaultValue={item ? item?.quantity : ""}
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
      <FlexboxGrid.Item colspan={5} style={{ marginTop: "0.5rem" }}>
        <span className="input-title">Cantidad por unidad</span>
        <Input
          size="lg"
          placeholder="0"
          type="number"
          defaultValue={item ? item?.unitQuantity : ""}
          inputRef={register({
            required: true,
            setValueAs: (v) => parseInt(v),
          })}
          name="unitQuantity"
        />
        {errors.unitQuantity && <FormErrorMessage message="El campo es requerido" />}
      </FlexboxGrid.Item>
      <DeviceCharacteristicsForm
        characteristicsData={deviceCharacteristics}
      />
      {errors.characteristics &&
        <FormErrorMessage message={errors.characteristics.message} />
      }
      <StoreItemForm
        stores={stores}
        storeData={storeData}
        quantityData={quantityData}
      />
    </FlexboxGrid>
  );
}
