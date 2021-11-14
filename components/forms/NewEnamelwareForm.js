import { useEffect, useState } from "react";
import { FlexboxGrid, Input, SelectPicker } from "rsuite";
import { Controller } from "react-hook-form";

import FormDropdownFooter from "./common/FormDropdownFooter";
import FormErrorMessage from "../common/FormErrorMessage";
import StoreItemForm from "./common/StoreItemForm";

import currencyData from "../../public/staticData/Common-Currency.json";

import "../../styles/forms.less";

export default function NewEnamelwareForm({
  token,
  stores,
  mutate,
  materialsData,
  sizes,
  errors,
  register,
  control,
  storeItemData,
  item,
  itemStores
}) {
  const quantityData = useState('');
  const [isAddingMaterial, handleAddingMaterial] = useState(false);
  const [isAddingSize, handleAddingSize] = useState(false);

  useEffect(() => {
    if (item && itemStores) {
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
  }, []);

  const splitSizeField = (sizeText, whichField = "size1Number") => {
    let number1 = "", number2 = "", splitedSize1 = "", splitedSize2 = "";

    const twoSized = sizeText.split("x");

    for (let i = 0; i < twoSized[0].length; i++) {
      if (twoSized[0][i] >= "0" && twoSized[0][i] <= "9") {
        number1 += twoSized[0][i];
      }
    }
    splitedSize1 = twoSized[0].substr(twoSized[0].indexOf(number1) + number1.length);

    if (twoSized.length === 2) {
      for (let i = 0; i < twoSized[1].length; i++) {
        if (twoSized[1][i] >= "0" && twoSized[1][i] <= "9") {
          number2 += twoSized[1][i];
        }
      }
      splitedSize2 = twoSized[1].substr(twoSized[1].indexOf(number2) + number2.length);
    }

    switch (whichField) {
      case "size1Number":
        return number1;
      case "size1Measure":
        return splitedSize1;
      case "size2Number":
        return number2;
      case "size2Measure":
        return splitedSize2;
    }
  }

  return (
    <FlexboxGrid justify="space-between" className="form">
      <FlexboxGrid.Item colspan={8}>
        <span className="text-black text-bold input-title">Nombre</span>
        <Input
          size="lg"
          placeholder="Tenedor"
          defaultValue={item ? item?.name : ""}
          name="name"
          inputRef={register({ required: true })}
        />
        {errors.name && (
          <FormErrorMessage message="El campo es requerido"/>
        )}
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
              defaultValue={item ? splitSizeField(item?.size) : ""}
              inputRef={register({ required: true })}
            />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={5}>
            <Controller
              name="size1Measure"
              control={control}
              defaultValue={item ? splitSizeField(item?.size, "size1Measure") : ""}
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
                          mutate={mutate}
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
              defaultValue={item ? splitSizeField(item?.size, "size2Number") : ""}
              name="size2Number"
              type="number"
              inputRef={register()}
            />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={5}>
            <Controller
              name="size2Measure"
              control={control}
              defaultValue={item ? splitSizeField(item?.size, "size2Measure") : ""}
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
        {(errors.size1Number || errors.size1Measure || errors.size2Number || errors.size2Measure) && (
          <FormErrorMessage message="El campo es requerido"/>
        )}
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={7}>
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
        {errors.material && (
          <FormErrorMessage message="El campo es requerido"/>
        )}
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={8} style={{ marginTop: ".5rem" }}>
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
        </FlexboxGrid>
        {(errors.priceText || errors.priceCurrency) && (
          <FormErrorMessage message="El campo es requerido"/>
        )}
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
        {errors.quantity && (
          <FormErrorMessage message="El campo es requerido"/>
        )}
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={7} style={{ marginTop: ".5rem" }}>
        <span className="input-title">Cantidad por unidad</span>
        <Input
          size="lg"
          placeholder="0"
          defaultValue={item ? item?.unitQuantity : ""}
          type="number"
          inputRef={register({
            required: true,
            setValueAs: (v) => parseInt(v),
          })}
          name="unitQuantity"
        />
        {errors.unitQuantity && (
          <FormErrorMessage message="El campo es requerido"/>
        )}
      </FlexboxGrid.Item>
      <StoreItemForm
        stores={stores}
        storeData={storeItemData}
        quantityData={quantityData}
      />
    </FlexboxGrid>
  );
}
