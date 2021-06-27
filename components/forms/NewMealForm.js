import { useState, useEffect } from "react";
import {useRouter} from "next/router";
import { DatePicker, FlexboxGrid, Input, SelectPicker } from "rsuite";
import { Controller } from "react-hook-form";

import StoreItemForm from "./common/StoreItemForm";
import FormDropdownFooter from "./common/FormDropdownFooter";
import FormErrorMessage from "../common/FormErrorMessage";

import {useItem} from "../../swr";

import currencyData from "../../public/staticData/Common-Currency.json";

import "../../styles/forms.less";

const NewMealForm = ({
  register,
  errors,
  control,
  stores,
  mealPresentations,
  contentMeasures,
  storeItemData,
  token,
}) => {
  const history = useRouter();
  const { id } = history.query;
  const quantityData = useState('');
  const [isAddingPresentation, handleAddingPresentation] = useState(false);
  const { item, itemStores = [] } = useItem(token, id ? id : '');

  useEffect(() => {
    if(id && item && itemStores) {
      quantityData[1](item?.quantity || 0);
      storeItemData[1](
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
          placeholder="Harina Pan"
          defaultValue={item ? item?.name : ""}
          name="name"
          inputRef={register({ required: true })}
        />
        {errors.name && <FormErrorMessage message="El campo es requerido" />}
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={7}>
        <span className="text-black text-bold input-title">Presentación</span>
        <Controller
          name="presentation"
          control={control}
          defaultValue={item ? item?.presentation : ""}
          rules={{ required: true }}
          render={(field) => (
            <SelectPicker
              {...field}
              className="select-dropdown"
              data={mealPresentations}
              searchable={false}
              cleanable={false}
              renderExtraFooter={() => {
                return (
                  <div style={{ padding: "0.5em", width: "100%" }}>
                    <FormDropdownFooter
                      isEditing={isAddingPresentation}
                      setEditing={handleAddingPresentation}
                      placeholder="Presentación"
                      route="meal-presentation"
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
      <FlexboxGrid.Item colspan={7}>
        <span className="input-title">Contenido</span>
        <FlexboxGrid justify="space-between">
          <FlexboxGrid.Item colspan={15}>
            <Input
              name="contentText"
              defaultValue={item ? item.content?.split(" ")[0] : ""}
              inputRef={register({
                required: true,
                setValueAs: (v) => parseInt(v),
              })}
              size="lg"
              type="number"
              placeholder={0.0}
            />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={8}>
            <Controller
              name="contentMeasure"
              defaultValue={item ? item.content?.split(" ")[1] : ""}
              control={control}
              rules={{ required: true }}
              render={(field) => (
                <SelectPicker
                  {...field}
                  className="select-dropdown"
                  data={contentMeasures}
                  cleanable={false}
                  searchable={false}
                />
              )}
            />
          </FlexboxGrid.Item>
          {errors.contentText && <FormErrorMessage message="El campo es requerido" />}
          {errors.contentMeasure && <FormErrorMessage message="El campo es requerido" />}
        </FlexboxGrid>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={6} style={{ marginTop: "0.5rem" }}>
        <span className="input-title">Precio</span>
        <FlexboxGrid justify="space-between">
          <FlexboxGrid.Item colspan={15}>
            <Input
              size="lg"
              placeholder="0"
              defaultValue={item ? item.price?.split(" ")[1] : ""}
              type="number"
              inputRef={register({
                required: true,
                setValueAs: (v) => parseInt(v),
              })}
              name="price"
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
          defaultValue={item ? item.quantity : ""}
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
          defaultValue={item ? item.unitQuantity : ""}
          type="number"
          inputRef={register({
            required: true,
            setValueAs: (v) => parseInt(v),
          })}
          name="unitQuantity"
        />
        {errors.unitQuantity && <FormErrorMessage message="El campo es requerido" />}
      </FlexboxGrid.Item>
      <FlexboxGrid.Item
        colspan={5}
        style={{ marginTop: "0.5rem", marginBottom: "2rem" }}
      >
        <span className="input-title">Fecha de Vencimiento</span>
        <Controller
          name="expiredDate"
          control={control}
          rules={{ required: true }}
          defaultValue={item ? new Date(item.expiratedDate) : new Date()}
          render={(field) => (
            <DatePicker
              {...field}
              className="select-dropdown"
              format="MM-YYYY"
              placement="autoVerticalStart"
              cleanable={false}
            />
          )}
        />
        {errors.expiredDate && <FormErrorMessage message="El campo es requerido" />}
      </FlexboxGrid.Item>
      <StoreItemForm
        stores={stores}
        storeData={storeItemData}
        quantityData={quantityData}
      />
    </FlexboxGrid>
  );
};

export default NewMealForm;
