import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  FlexboxGrid,
  Input,
  SelectPicker,
  Notification,
} from "rsuite";
import { useForm, Controller } from "react-hook-form";
import Crc from "country-state-city";

import LoadingScreen from "../../components/layouts/LoadingScreen";
import StoreItemsTable from "../../components/tables/StoreItemsTable";
import StoreFormModal from "../../components/modals/StoreFormModal";
import TransferItemFormModal from "../../components/modals/TransferItemFormModal";
import BasicActionsButtonGroup from "../../components/customComponents/BasicActionsButtonGroup";
import BackButton from "../../components/common/BackButton";

import { useCurrentUser, useNotesByStore, useStore, useStoreItems, useStores } from "../../hooks";
import routes from "../../config/routes";
import AxiosService from "../../services/Axios"

import "../../styles/custom-theme.less";
import "../../styles/forms.less";
import NotesTable from "../../components/tables/NotesTable";

export default function StoreDetailPage({ handleLogged, user }) {
  const router = useRouter();
  const storeItemForm = useForm();
  const [transferItemModalOpen, setTransferItemModalOpen] = useState(false);
  const [isAdding, handleAdding] = useState(false);
  const [isEditingItem, handleEditingItem] = useState(false);
  const [isModalOpen, handleIsModalOpen] = useState(false);
  const [isLoading, handleLoading] = useState(false);
  const [transferLoading, setTransferLoanding] = useState(false);
  const { isEmpty } = useCurrentUser();
  const {
    loading: itemLoading,
    items,
    mutate: itemsMutate
  } = useStoreItems(router.query.id, user?.token);
  const { store, isLoading: storeLoading, mutate } = useStore(router.query.id, user?.token);
  const { stores, isLoading: storesLoading } = useStores(user?.token);
  const { notes, isLoading: notesLoading, mutate: notesMutate } = useNotesByStore(router.query.id, user?.token);

  useEffect(() => {
    if (isEmpty) {
      router.push('/login');
    }

    handleLogged(true);
  }, [])

  const onAdd = () => {
    handleAdding(true);
  }

  const onExitAdd = () => {
    handleAdding(false);
  }

  const onTransferItem = async (data) => {
    setTransferLoanding(true);
    try {
      await AxiosService.instance.post(
        `${routes.getStores}/items`, data, {
          headers: {
            Authorization: user.token
          }
        }
      );

      await mutate();
      await itemsMutate();

      Notification.success({
        title: "Transferencia Exitosa",
        placement: "bottomStart",
        duration: 5000
      });

      setTransferLoanding(false);
      setTransferItemModalOpen(false);

    } catch (err) {
      Notification.error({
        title: "Error",
        description: "Ha ocurride un error al ejecutar la acción",
        placement: "bottomStart",
        duration: 5000
      });
    }
  }

  const onEdit = () => {
    handleIsModalOpen(true);
  }

  const onEditStore = async (data) => {
    handleLoading(true)
    try {
      await AxiosService.instance.put(routes.getStores + `/${store._id}`, data, {
        headers: {
          Authorization: user.token
        }
      });
      await mutate();
      Notification.success({
        title: "Almacén actualizado",
        placement: "topEnd",
        duration: 9000,
        description: `El almacén ha sido actualizado`
      });
    } catch (err) {
      console.error(err.response.data.message);
    }
    handleLoading(false);
    handleIsModalOpen(false);
  }

  const onSubmitEditStoreItems = async (data) => {
    const storeItemData = {
      itemId: data.itemId,
      itemName: items.filter(item => item._id === data.itemId)[0].name,
      quantity: data.quantity
    };

    try {
      if (isEditingItem) {
        await AxiosService.instance.put(`${routes.getStores}/${store._id}`,
          { ...store, items: [...store.items, storeItemData] },
          {
            headers: {
              Authorization: user.token
            }
          });
      } else {
        await AxiosService.instance.post(`${routes.getStores}/${store._id}/items`, [storeItemData], {
          headers: {
            Authorization: user.token
          }
        });
      }
      Notification.success({
        title: isEditingItem ? "Item actualizado" : "Item agregado",
        placement: "topEnd",
        duration: 9000,
        description: `El item ${storeItemData.itemId} ha sido ${isEditingItem ? "actualizado para" : "agregado al"} almacén ${store.name}`
      });
      await mutate();
      await itemsMutate();

    } catch (err) {
      console.error(err.response.data.message);
    }
    handleEditingItem(false);
  }

  if (itemLoading || storeLoading || storesLoading || notesLoading) return <LoadingScreen/>;

  return <>
    <FlexboxGrid>
      <FlexboxGrid.Item colspan={1}>
        <BackButton route="stores" placeholder="Almacenes"/>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={20}>
        <h2 className="text-bolder">{store.name}</h2>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={3} className="responsive-box">
        <BasicActionsButtonGroup
          withoutDelete
          disabled={store.disabled}
          itemMutate={mutate}
          onEdit={onEdit}
          token={user?.token}
          route={`/stores/${store._id}`}
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={24} style={{ marginTop: "2rem" }}>
        <div className="info-box shadow">
          <h4 className="text-color-primary text-bolder">Información General</h4>
          <FlexboxGrid justify="space-between" className="info">
            <FlexboxGrid.Item>
              <span>Dirección</span>
              <p>{store.addressLine}</p>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <span>Ciudad</span>
              <p>{store.addressCity}</p>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <span>Estado</span>
              <p>{Crc.getStatesOfCountry(store.addressCountry).filter(state => state.isoCode === store.addressState)[0]?.name}</p>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <span>Pais</span>
              <p>{Crc.getCountryByCode(store.addressCountry)?.name}</p>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <span>Código Postal</span>
              <p>{store.addressZipcode}</p>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <span>Estado</span>
              <p style={{ color: store.disabled ? "red" : "green" }}>{store.disabled ? "Inactivo" : "Activo"}</p>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </div>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={24} style={{ marginTop: "2rem" }} className="info-box shadow">
        <FlexboxGrid>
          <FlexboxGrid.Item colspan={20}>
            <h4 className="text-color-primary text-bolder">Items en Almacén</h4>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={4} style={{ marginBottom: "1rem" }}>
            <Button
              block
              appearance="primary"
              className="text-bold"
              style={{ padding: "0.7em" }}
              onClick={() => setTransferItemModalOpen(true)}
            >
              Transferir Item
            </Button>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={1}/>
          <FlexboxGrid.Item colspan={24} style={{ margin: "1rem 0", display: isAdding ? "initial" : "none" }}
                            className="form">
            <FlexboxGrid>
              <FlexboxGrid.Item colspan={6}>
                <span className="input-title">Item</span>
                <Controller
                  name="item"
                  defaultValue=""
                  control={storeItemForm.control}
                  rules={{ required: true }}
                  render={(field) => (
                    <SelectPicker
                      {...field}
                      data={items.filter(item => !store.items.some(storeItem => storeItem.itemId === item._id))}
                      className="select-dropdown with-shadow"
                      labelKey="name"
                      valueKey="_id"
                    />
                  )}/>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={1}/>
              <FlexboxGrid.Item colspan={6}>
                <span className="input-title">Cantidad</span>
                <Input
                  name="quantity"
                  size="lg"
                  className="with-shadow"
                  placeholder={0}
                  inputRef={storeItemForm.register({ required: true })}
                  type="number"
                />
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={1}/>
              <FlexboxGrid.Item colspan={3} style={{ paddingTop: "1.3rem" }}>
                <span className="input-title">{" "}</span>
                <Button
                  block
                  className="button bg-color-secundary text-medium shadow"
                  appearance="primary"
                  onClick={storeItemForm.handleSubmit(onSubmitEditStoreItems)}
                >
                  Agregar
                </Button>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={24}>
            <StoreItemsTable items={items} store={store}/>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={24} style={{ margin: "2rem 0" }}>
        <h4 className="text-bolder">Ordenes de Entrega</h4>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={24}>
        <NotesTable
          notes={notes}
          token={user?.token}
          readOnly
          mutate={notesMutate}
        />
      </FlexboxGrid.Item>
    </FlexboxGrid>
    <StoreFormModal
      isUpdateStore
      onSubmit={onEditStore}
      handleOpen={handleIsModalOpen}
      isOpen={isModalOpen}
      newStoreLoading={isLoading}
      selectedStore={store}/>
    <TransferItemFormModal
      store={store}
      loading={transferLoading}
      onSubmit={onTransferItem}
      storeId={store._id}
      handleOpen={setTransferItemModalOpen}
      isOpen={transferItemModalOpen}
      stores={stores}
      storeItems={items}
    />
  </>
}