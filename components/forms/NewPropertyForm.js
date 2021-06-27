import { useState, useEffect } from "react";
import { FlexboxGrid, Input, SelectPicker } from "rsuite";
import { Controller } from "react-hook-form";
import {useRouter} from "next/router";
import Crc from "country-state-city";

import FormDropdownFooter from "./common/FormDropdownFooter";
import StoreItemForm from "./common/StoreItemForm";
import FormErrorMessage from "../common/FormErrorMessage";

import {useItem} from "../../swr";

import currencyData from "../../public/staticData/Common-Currency.json";

import "../../styles/forms.less";

export default function NewPropertyForm({
  register,
  control,
  errors,
  token,
  stores,
  marks,
  materials,
  storeData
}) {
  const history = useRouter();
  const { id } = history.query;
  const quantityData = useState('');
  const [isAddingMark, handleAddingMark] = useState(false);
  const [isAddingMaterial, handleAddingMaterial] = useState(false);
  const [selectedCountry, setCountry] = useState("");
  const [selectedState, setState] = useState("");
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
    }
  }, [id]);

  return (
    <FlexboxGrid className="form" justify="space-between">
      <FlexboxGrid.Item colspan={5}>
        <span className="text-black text-bold input-title">Nombre</span>
        <Input
          size="lg"
          placeholder="Mueble"
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
          defaultValue={item ? item?.serial : ""}
          name="serial"
          inputRef={register({ required: true })}
        />
        {errors.serial && <FormErrorMessage message="El campo es requerido" />}
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={5}>
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
                      isEditing={isAddingMark}
                      setEditing={handleAddingMark}
                      placeholder="Marca"
                      route="property/marks"
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
        <span className="input-title">Material</span>
        <Controller
          name="material"
          control={control}
          defaultValue={item ? item?.material : ""}
          rules={{ required: true }}
          render={(field) => (
            <SelectPicker
              {...field}
              className="select-dropdown"
              data={materials}
              searchable={false}
              cleanable={false}
              renderExtraFooter={() => {
                return (
                  <div style={{ padding: "0.5em", width: "100%" }}>
                    <FormDropdownFooter
                      isEditing={isAddingMaterial}
                      setEditing={handleAddingMaterial}
                      placeholder="Material"
                      route="property/materials"
                      token={token}
                    />
                  </div>
                );
              }}
            />
          )}
        />
        {errors.material && <FormErrorMessage message="El campo es requerido" />}
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
      <FlexboxGrid.Item colspan={5} style={{ marginTop: "0.5rem" }}>
        <span className="input-title">Cantidad</span>
        <Input
          size="lg"
          placeholder="0"
          defaultValue={item ? item?.quantity : ""}
          type="number"
          inputRef={register({
            required: true,
            setValueAs: (v) => parseInt(v),
          })}
          name="quantity"
          value={quantityData[0]}
          onChange={(value) => quantityData[1](parseInt(value))}
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
      <FlexboxGrid.Item colspan={11} style={{ marginTop: "0.5rem" }}>
        <span className="text-black text-bold input-title">Dirección</span>
        <Input
          size="lg"
          placeholder="Av. Upata"
          name="addressLine"
          defaultValue={item ? item?.addressLine : ""}
          inputRef={register()}
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={5} style={{ marginTop: "0.5rem" }}>
        <span className="input-title">País</span>
        <Controller
          name="addressCountry"
          control={control}
          defaultValue={item ? item?.addressCity : ""}
          render={(field) => (
            <SelectPicker
              {...field}
              cleanable={false}
              placement="autoVerticalStart"
              className="select-dropdown"
              data={Crc.getAllCountries()}
              labelKey="name"
              valueKey="isoCode"
              onSelect={(value, item) => {
                setCountry(value);
              }}
            />
          )}
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={5} style={{ marginTop: "0.5rem" }}>
        <span className="input-title">Estado</span>
        <Controller
          name="addressState"
          control={control}
          defaultValue={item ? item?.addressState : ""}
          render={(field) => (
            <SelectPicker
              {...field}
              cleanable={false}
              placement="autoVerticalStart"
              className="select-dropdown"
              data={Crc.getStatesOfCountry(selectedCountry)}
              labelKey="name"
              valueKey="isoCode"
              onSelect={(value, item) => {
                setState(value);
              }}
            />
          )}
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={5} style={{ marginTop: "0.5rem" }}>
        <span className="input-title">Ciudad</span>
        <Controller
          name="addressCity"
          defaultValue={item ? item?.addressCity : ""}
          control={control}
          render={(field) => {
            return (
              <SelectPicker
                {...field}
                cleanable={false}
                searchable={false}
                placement="autoVerticalStart"
                className="select-dropdown"
                data={Crc.getCitiesOfState(selectedCountry, selectedState)}
                labelKey="name"
                valueKey="name"
              />
            );
          }}
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={5} style={{ marginTop: "0.5rem" }}>
        <span className="input-title">Código Postal</span>
        <Controller
          name="addressZipcode"
          defaultValue={item ? item?.addressZipcode : ""}
          control={control}
          render={(field) => <Input {...field} size="lg" placeholder="8050" />}
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={10} style={{ marginTop: "0.5rem" }}>
        <span className="input-title">Descripción</span>
        <Input
          style={{ border: 0 }}
          size="lg"
          name="description"
          defaultValue={item ? item?.description : ""}
          inputRef={register()}
          componentClass="textarea"
          rows={4}
          placeholder="Escriba una breve descripción del Inmueble"
        />
      </FlexboxGrid.Item>
      <StoreItemForm
        stores={stores}
        storeData={storeData}
        quantityData={quantityData}
      />
    </FlexboxGrid>
  );
}
