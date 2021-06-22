import {useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {Button, FlexboxGrid, Input, InputGroup, SelectPicker} from "rsuite";
import {useStoreItems} from "../../swr";
import DeliveryNoteItemsTable from "../tables/DeliveryNoteItemsTable";
import FormErrorMessage from "../common/FormErrorMessage";

export default function NewDeliveryNoteItemsForm({ token, stores, selectedStoreItems }) {
  const { handleSubmit, errors, control, register, reset } = useForm({
    defaultValues: { storeId: '', itemId: "", quantity: '' }
  });
  const [selectedStore, setSelectedStore] = useState('');
  const [selectedItem, setSelectedItem] = useState({});
  const { items } = useStoreItems(selectedStore, token);

  const onAddStoreItem = (data) => {
    const index = selectedStoreItems[0].findIndex(item => item.itemId === data.itemId);
    if(index >= 0){
      selectedStoreItems[1](
        selectedStoreItems[0].map(item => {
          if(item.itemId === data.itemId) {
            return {
              storeId: data.storeId,
              storeName: stores.filter(store => store._id === selectedStore)[0].name,
              itemId: data.itemId,
              itemName: selectedItem.name,
              quantity: data.quantity
            }
          }

          return item;
        })
      );
    } else {
      selectedStoreItems[1]([
        ...selectedStoreItems[0],
        {
          storeId: data.storeId,
          storeName: stores.filter(store => store._id === selectedStore)[0].name,
          itemId: data.itemId,
          itemName: selectedItem.name,
          quantity: data.quantity
        }
      ])
    }
    setSelectedItem({});
    setSelectedStore('');
    reset({ storeId: '', itemId: "", quantity: '' });
  }

  return (
    <FlexboxGrid.Item colspan={24}>
      <FlexboxGrid justify="space-between">
        <FlexboxGrid.Item colspan={24} style={{ margin: "2rem 0 1rem 0" }}>
          <h4 className="text-bolder">Items de la Nota de Entrega</h4>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={5}>
          <span className="input-title">Almacén</span>
          <Controller
            name="storeId"
            control={control}
            rules={{ required: true }}
            render={(field) => (
              <SelectPicker
                {...field}
                value={selectedStore}
                onSelect={(value) => setSelectedStore(value)}
                className="select-dropdown"
                data={stores}
                labelKey="name"
                valueKey="_id"
                searchable={false}
                cleanable={false}
              />
            )}
          />
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={6}>
          <span className="input-title">Item</span>
          <Controller
            name="itemId"
            control={control}
            rules={{ required: true }}
            render={(field) => (
              <SelectPicker
                {...field}
                className="select-dropdown"
                data={items}
                onSelect={(value, item) => setSelectedItem(item)}
                labelKey="name"
                valueKey="_id"
                searchable={false}
                cleanable={false}
              />
            )}
          />
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={5}>
          <span className="input-title">Cantidad</span>
          <InputGroup>
            <Input
              name="quantity"
              min={0}
              max={selectedItem.quantity || 0}
              type="number"
              size="lg"
              disabled={!selectedItem.quantity}
              inputRef={register({
                required: true,
                setValueAs: (v) => parseInt(v),
                validate: (value) => value > 0
              })}
            />
            <InputGroup.Addon>{selectedItem.quantity || 0}</InputGroup.Addon>
          </InputGroup>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={5}>
          <Button
            appearance="btn-primary"
            size="lg"
            className="button shadow bg-color-secundary text-white"
            style={{ marginTop: "1.6rem" }}
            onClick={handleSubmit(onAddStoreItem)}
          >
            Agregar
          </Button>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24}>
          {errors.storeId && <FormErrorMessage message="El campo Almacén es requerido" />}
          {errors.itemId && <FormErrorMessage message="El campo Item es requerido" />}
          {errors.quantity?.type === "required" && <FormErrorMessage message="El campo Cantidad es requerido" />}
          {errors.quantity?.type === "validate" && <FormErrorMessage message="La cantidad debe ser por lo menos 1" />}
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24}>
          <DeliveryNoteItemsTable data={selectedStoreItems[0]} handleData={selectedStoreItems[1]} />
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </FlexboxGrid.Item>
  );
}