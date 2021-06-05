import { useState } from "react";
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

const NewMedicineForm = ({
  control,
  register,
  errors,
  stores,
  storeData,
  quantityData,
  contentMeasures,
  markLabs,
  presentations,
  token,
}) => {
  const storeForm = useForm();
  const [isAddingMark, setAddingMark] = useState(false);
  const [isAddingPresentation, setAddingPresentation] = useState(false);

  const onAddStoreItem = (data) => {
    storeData[1]([
      ...storeData[0],
      {
        index: storeData[0].length,
        store: stores.filter((store) => store._id === data.storeId)[0].name,
        storeId: data.storeId,
        quantity: data.quantity,
      },
    ]);
  };

  return (
    <FlexboxGrid justify="space-between">
      <FlexboxGrid.Item colspan={8}>
        <span className="input-title">Nombre</span>
        <Input
          size="lg"
          name="name"
          inputRef={register({ required: true })}
          placeholder="Ibuprofeno"
        />
        {errors.name?.message && (
          <ErrorMessage show={true} placement="bottomStart">
            {errors?.name?.message}
          </ErrorMessage>
        )}
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={7}>
        <span className="input-title">Marca de laboratorio</span>
        <Controller
          name="markLab"
          control={control}
          defaultValue=""
          rules={{ required: true }}
          render={(field) => (
            <SelectPicker
              {...field}
              className="select-dropdown"
              data={markLabsData}
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
          defaultValue={new Date()}
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
        <FlexboxGrid>
          <FlexboxGrid.Item colspan={15}>
            <Input
              name="contentText"
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
              defaultValue=""
              control={control}
              rules={{ required: true }}
              render={(field) => (
                <SelectPicker
                  {...field}
                  className="select-dropdown"
                  data={contentMeasureData}
                  cleanable={false}
                  searchable={false}
                  renderExtraFooter={() => (
                    <FormDropdownFooter
                      placeholder="Medida"
                      route="markLabs"
                      token
                      isEditing={isMarkListEditing}
                      setEditing={setMarkListEditing}
                    />
                  )}
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
              inputRef={register({
                required: true,
                setValueAs: (v) => parseFloat(v),
              })}
              size="lg"
              type="number"
              placeholder={0.0}
            />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={1} />
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
        </FlexboxGrid>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={7} className="not-first-row">
        <span className="input-title">Presentación</span>
        <Controller
          name="presentation"
          defaultValue=""
          control={control}
          rules={{ required: true }}
          render={(field) => (
            <SelectPicker
              {...field}
              className="select-dropdown"
              data={presentationData}
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
          inputRef={register({
            required: true,
            setValueAs: (v) => parseInt(v),
          })}
          size="lg"
          type="number"
          placeholder={0}
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={4} className="not-first-row">
        <span className="input-title">Cantidad por unidad</span>
        <Input
          name="quantityUnit"
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
          inputRef={register()}
          componentClass="textarea"
          rows={4}
          placeholder="Escriba una breve descripción del medicamento"
        />
      </FlexboxGrid.Item>
      <StoreItemForm
        storeForm={storeForm}
        stores={stores}
        storeItemData={storeItemData}
        onAddStoreItem={onAddStoreItem}
        setStoreItemData={setStoreItemData}
      />
    </FlexboxGrid>
  );
};
export default NewMedicineForm;
