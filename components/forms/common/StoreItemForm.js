import { Button, ErrorMessage, FlexboxGrid, Input, SelectPicker } from "rsuite";
import { Controller } from "react-hook-form";
import NewItemStoreTable from "../../tables/NewItemStoreTable";

export default function StoreItemForm({
  stores,
  storeForm,
  storeData,
  quantityData,
  errorMessageData
}) {
  const onAddStoreItem = (data) => {
    errorMessageData[1]('');

    const index = storeData[0].findIndex(
      (item) => item.storeId === data.storeId
    );

    if(index < 0) {
      if(storeData[0].length){
        const quantity = storeData[0].reduce(function (acumulator, item) {
          return { quantity: acumulator.quantity + item.quantity }
        });
        if(quantity.quantity + data.quantity <= quantityData[0]){
          storeData[1]([...storeData[0], {
            index: storeData[0].length,
            store: stores.filter((store) => store._id === data.storeId)[0].name,
            storeId: data.storeId,
            quantity: data.quantity,
          }]);
        } else {
          errorMessageData[1]("La suma de la cantidad de items en cada almacen no debe superar la cantidad total del item.")
        }
      } else {
        storeData[1]([...storeData[0], {
          index: storeData[0].length,
          store: stores.filter((store) => store._id === data.storeId)[0].name,
          storeId: data.storeId,
          quantity: data.quantity,
        }]);
      }
    } else {
      const array = storeData[0].map((item, i) => {
        if (i === index) {
          return {
            index,
            store: stores.filter((store) => store._id === data.storeId)[0].name,
            storeId: data.storeId,
            quantity: data.quantity,
          }
        } else {
          return item
        }
      });

      const quantity = array.reduce(function (acumulator, item) {
        return { quantity: acumulator.quantity + item.quantity }
      });

      if(quantity.quantity <= quantityData[0]){
        storeData[1](array);
      } else {
        errorMessageData[1]("La suma de la cantidad de items en cada almacen no debe superar la cantidad total del item.")
      }
    }
  };

  return (
    <>
      <FlexboxGrid.Item colspan={24} style={{ margin: "2rem 0 1rem 0" }}>
        <h4>Almacenamiento</h4>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={24} style={{ marginBottom: "1rem" }}>
        <FlexboxGrid justify="space-between">
          <FlexboxGrid.Item colspan={6} style={{ marginBottom: "1rem" }}>
            <span className="input-title">Almacén</span>
            <Controller
              name="storeId"
              rules={{ required: true }}
              control={storeForm.control}
              render={(field) => (
                <SelectPicker
                  {...field}
                  className="select-dropdown"
                  data={stores}
                  cleanable={false}
                  searchable={false}
                  labelKey="name"
                  valueKey="_id"
                />
              )}
            />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={6}>
            <span className="input-title">Cantidad</span>
            <Input
              name="quantity"
              inputRef={storeForm.register({ required: true, setValueAs: (v) => parseInt(v), })}
              size="lg"
              type="number"
              placeholder="0"
            />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={2}>
            <Button
              style={{ marginTop: "2em" }}
              appearance="primary"
              className="bg-color-secundary shadow button text-white text-medium"
              block
              onClick={storeForm.handleSubmit(onAddStoreItem)}
            >
              Agregar
            </Button>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={8} />
          {errorMessageData[0] &&
            <FlexboxGrid.Item colspan={24} style={{ color: "red" }}>
              {errorMessageData[0]}
            </FlexboxGrid.Item>
          }
          <FlexboxGrid.Item colspan={24}>
            <NewItemStoreTable
              data={storeData[0]}
              handleData={storeData[1]}
            />
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </FlexboxGrid.Item>
    </>
  );
}
