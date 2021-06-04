import { Button, ErrorMessage, FlexboxGrid, Input, SelectPicker } from "rsuite";
import { Controller } from "react-hook-form";
import NewItemStoreTable from "../../tables/NewItemStoreTable";

export default function StoreItemForm({
  stores,
  storeForm,
  onAddStoreItem,
  storeItemData,
  setStoreItemData,
  showStoreQuantityError,
}) {
  return (
    <>
      <FlexboxGrid.Item
        colspan={24}
        style={{ marginBottom: "1rem", marginTop: "2rem" }}
      >
        <h4>Almacenamiento</h4>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={24} style={{ marginBottom: "1rem" }}>
        <FlexboxGrid>
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
          <FlexboxGrid.Item colspan={1} />
          <FlexboxGrid.Item colspan={6}>
            <span className="input-title">Cantidad</span>
            <Input
              name="quantity"
              inputRef={storeForm.register({ required: true })}
              size="lg"
              type="number"
              placeholder={0}
            />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={1} />
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
            {showStoreQuantityError && (
              <div style={{ color: "red" }}>
                Las cantidades agregadas no deben sobrepasar la cantidad de
                insumos introducidos
              </div>
            )}
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={24}>
            <NewItemStoreTable
              data={storeItemData}
              handleData={setStoreItemData}
            />
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </FlexboxGrid.Item>
    </>
  );
}
