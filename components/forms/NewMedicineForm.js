import {useEffect, useState} from "react";
import {
  ErrorMessage,
  DatePicker,
  FlexboxGrid,
  Input,
  SelectPicker,
} from "rsuite";
import { Controller, useForm } from "react-hook-form";

import StoreItemForm from "./common/StoreItemForm";
import FormDropdownFooter from "./common/FormDropdownFooter";
import currencyData from "../../public/staticData/Common-Currency.json";
import {useItem} from "../../swr";
import {useRouter} from "next/router";
import FormErrorMessage from "../common/FormErrorMessage";
import LoadingScreen from "../layouts/LoadingScreen";

const NewMedicineForm = ({
  control,
  register,
  errors,
  stores,
  storeData,
  contentMeasures,
  markLabs,
  presentations,
  token
}) => {
  const history = useRouter();
  const { id } = history.query;
  const quantityData = useState('');
  const [isAddingMark, setAddingMark] = useState(false);
  const [isAddingPresentation, setAddingPresentation] = useState(false);
  const { item, itemStores = [], isLoading } = useItem(token, id ? id : '');

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

  if(isLoading) return <LoadingScreen />

  return (
    <FlexboxGrid justify="space-between">
      <FlexboxGrid.Item colspan={8}>
        <span className="input-title">Nombre</span>
        <Input
          size="lg"
          name="name"
          defaultValue={item?.name || ""}
          inputRef={register({ required: true })}
          placeholder="Ibuprofeno"
        />
        {errors.name && (
          <FormErrorMessage message="El campo es requerido" />
        )}
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={7}>
        <span className="input-title">Marca de laboratorio</span>
        <Controller
          name="markLab"
          control={control}
          defaultValue={item?.markLab || ""}
          rules={{ required: true }}
          render={(field) => (
            <SelectPicker
              {...field}
              className="select-dropdown"
              data={markLabs}
              cleanable={false}
              searchable={false}
              renderExtraFooter={() => (
                <FormDropdownFooter
                  placeholder="Marca"
                  token={token}
                  route="medicine/mark-labs"
                  isEditing={isAddingMark}
                  setEditing={setAddingMark}
                />
              )}
            />
          )}
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={7}>
        <span className="input-title">Fecha de Vencimiento</span>
        <Controller
          name="expiredDate"
          control={control}
          rules={{ required: true }}
          defaultValue={item?.expiratedDate ? new Date(item.expiratedDate) : new Date(Date.now())}
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
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={8} className="not-first-row">
        <span className="input-title">Contenido</span>
        <FlexboxGrid justify="space-between">
          <FlexboxGrid.Item colspan={15}>
            <Input
              name="contentText"
              defaultValue={item?.content?.split(' ')[0] || ""}
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
              defaultValue={item?.content?.split(' ')[1] || ""}
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
        </FlexboxGrid>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={7} className="not-first-row">
        <span className="input-title">Precio</span>
        <FlexboxGrid>
          <FlexboxGrid.Item colspan={15}>
            <Input
              name="priceText"
              defaultValue={item?.price?.split(' ')[1] || ""}
              inputRef={register({
                required: true,
                setValueAs: (v) => parseFloat(v),
              })}
              size="lg"
              type="number"
              placeholder="0.0"
            />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={1} />
          <FlexboxGrid.Item colspan={8}>
            <Controller
              name="priceCurrency"
              defaultValue={item?.price?.split(' ')[0] || ""}
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
        </FlexboxGrid>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={7} className="not-first-row">
        <span className="input-title">Presentación</span>
        <Controller
          name="presentation"
          defaultValue={item?.presentation || ""}
          control={control}
          rules={{ required: true }}
          render={(field) => (
            <SelectPicker
              {...field}
              className="select-dropdown"
              data={presentations}
              cleanable={false}
              searchable={false}
              renderExtraFooter={() => (
                <FormDropdownFooter
                  placeholder="Presentación"
                  route="medicine/presentations"
                  token={token}
                  isEditing={isAddingPresentation}
                  setEditing={setAddingPresentation}
                />
              )}
            />
          )}
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={4} className="not-first-row">
        <span className="input-title">Cantidad</span>
        <Input
          name="quantity"
          defaultValue={item?.quantity || ""}
          value={quantityData[0]}
          onChange={(e) => quantityData[1](parseInt(e))}
          inputRef={register({
            required: true,
            setValueAs: (v) => parseInt(v),
          })}
          size="lg"
          type="number"
          placeholder="0"
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={4} className="not-first-row">
        <span className="input-title">Cantidad por unidad</span>
        <Input
          name="quantityUnit"
          defaultValue={item?.unitQuantity || ""}
          inputRef={register({
            required: true,
            setValueAs: (v) => parseInt(v),
          })}
          size="lg"
          type="number"
          placeholder={0}
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={12} className="not-first-row">
        <span className="input-title">Descripción</span>
        <Input
          style={{ border: 0 }}
          size="lg"
          name="description"
          defaultValue={item?.description || ""}
          inputRef={register()}
          componentClass="textarea"
          rows={4}
          placeholder="Escriba una breve descripción del medicamento"
        />
      </FlexboxGrid.Item>
      <StoreItemForm
        stores={stores}
        storeData={storeData}
        quantityData={quantityData}
      />
    </FlexboxGrid>
  );
};

export default NewMedicineForm;
