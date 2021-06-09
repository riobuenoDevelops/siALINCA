import { useState } from "react";
import { Button, DatePicker, FlexboxGrid, Input, SelectPicker } from "rsuite";
import { Controller, useForm } from "react-hook-form";

import StoreItemForm from "./common/StoreItemForm";
import currencyData from "../../public/staticData/Common-Currency.json";
import AxiosService from "../../services/Axios";
import routes from "../../config/routes";

import "../../styles/forms.less";
import FormDropdownFooter from "./common/FormDropdownFooter";

const NewMealForm = ({
  register,
  errors,
  control,
  stores,
  mealPresentations,
  contentMeasures,
  storeItemData,
  quantityData,
  token,
}) => {
  const storeForm = useForm();
  const [errorMessage, setErrorMessage] = useState('');
  const [isAddingPresentation, handleAddingPresentation] = useState(false);

  return (
    <FlexboxGrid className="form" justify="space-between">
      <FlexboxGrid.Item colspan={8}>
        <span className="text-black text-bold input-title">Nombre</span>
        <Input
          size="lg"
          placeholder="Harina Pan"
          name="name"
          inputRef={register({ required: true })}
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={7}>
        <span className="text-black text-bold input-title">Presentación</span>
        <Controller
          name="presentation"
          control={control}
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
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={7}>
        <span className="input-title">Contenido</span>
        <FlexboxGrid justify="space-between">
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
                  data={contentMeasures}
                  cleanable={false}
                  searchable={false}
                />
              )}
            />
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={6} style={{ marginTop: "0.5rem" }}>
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
          onChange={(value) => quantityData[1](parseInt(value))}
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
      <FlexboxGrid.Item
        colspan={5}
        style={{ marginTop: "0.5rem", marginBottom: "2rem" }}
      >
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
      <StoreItemForm
        stores={stores}
        storeData={storeItemData}
        quantityData={quantityData}
        storeForm={storeForm}
        errorMessageData={[errorMessage, setErrorMessage]}
      />
    </FlexboxGrid>
  );
};

export default NewMealForm;
