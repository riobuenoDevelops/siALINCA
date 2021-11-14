import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { FlexboxGrid, Notification } from "rsuite";
import FlexboxGridItem from "rsuite/lib/FlexboxGrid/FlexboxGridItem";

import LoadingScreen from "../../components/layouts/LoadingScreen";
import SearchInput from "../../components/Search/SearchInput";
import StoresTable from "../../components/tables/StoresTable";
import StoreFormModal from "../../components/modals/StoreFormModal";
import StoreItemsFormModal from "../../components/modals/StoreItemsFormModal";
import TransferItemFormModal from "../../components/modals/TransferItemFormModal";

import { useCurrentUser, useItems, useStores } from "../../hooks";
import AxiosService from "../../services/Axios";
import routes from "../../config/routes";

export default function StorePage({
  handleLogged,
  user,
  storeModalIsOpen,
  handleStoreModalOpen,
}) {
  const history = useRouter();
  const { i18n } = useTranslation();
  const [inputValue, handleInputValue] = useState("");
  const [storeLoading, handleStoreLoading] = useState(false);
  const [isUpdateStore, handleUpdateStore] = useState(false);
  const [isAddingItems, handleAddingItems] = useState(false);
  const [isTransferItems, handleTransferItems] = useState(false);
  const [transferLoading, setTransferLoanding] = useState(false);
  const [selectedStore, handleSelectedStore] = useState({});
  const { isEmpty } = useCurrentUser();
  const { stores, isLoading: storesLoading, mutate } = useStores(user?.token);
  const { items, isLoading: itemsLoading, mutate: itemsMutate } = useItems(user?.token, user?.user.userConfig.nivelInventario);

  useEffect(() => {
    if (isEmpty) {
      handleLogged(false);
      history.push('/login');
    }

    handleLogged(true);
  }, []);

  const onSubmitUpdateStore = async (data) => {
    handleStoreLoading(true);

    const storeData = {
      name: data.name,
      addressLine: data.addressLine,
      addressCity: data.addressCity,
      addressState: data.addressState,
      addressCountry: data.addressCountry,
      addressZipcode: data.addressZipcode,
      disabled: false
    };

    try {
      if (!isUpdateStore) {
        await AxiosService.instance.post(routes.newStore, storeData, {
          headers: {
            Authorization: user.token,
          },
        });
      } else {
        await AxiosService.instance.put(
          routes.newStore + `/${selectedStore._id}`,
          storeData,
          {
            headers: {
              Authorization: user.token,
            },
          }
        );
      }
      await mutate();

      Notification.success({
        title: isUpdateStore ? "Almacen Actualizado" : "Nuevo Almacén",
        description: `Se ha ${
          isUpdateStore ? "actualizado" : "creado"
        } el almacén exitosamente`,
        duration: 9000,
        placement: "bottomStart",
      });
    } catch (err) {
      console.log(err);
    }
    handleUpdateStore(false);
    handleStoreModalOpen(false);
    handleStoreLoading(false);
  };

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
      handleTransferItems(false);

    } catch (err) {
      Notification.error({
        title: "Error",
        description: "Ha ocurride un error al ejecutar la acción",
        placement: "bottomStart",
        duration: 5000
      });
    }
  }

  const onHandleInputValue = (value) => {
    handleInputValue(value);
  };

  if (storesLoading || itemsLoading) return <LoadingScreen/>;

  return (
    <>
      <FlexboxGrid align="middle">
        <FlexboxGrid.Item colspan={24}>
          <FlexboxGrid align="middle" style={{ marginBottom: "2em" }}>
            <FlexboxGridItem colspan={16}>
              <h2 className="text-black text-bolder">
                Almacenes ({i18n.t(`roles.${user?.user?.roleName}`)})
              </h2>
            </FlexboxGridItem>
            <FlexboxGridItem colspan={8}>
              <SearchInput
                placehoderLabel="Almacen"
                value={inputValue}
                handleValue={onHandleInputValue}
              />
            </FlexboxGridItem>
          </FlexboxGrid>
        </FlexboxGrid.Item>
        <FlexboxGridItem colspan={24}>
          <StoresTable
            mutate={mutate}
            searchInputValue={inputValue}
            items={stores.filter((store) => {
              return !inputValue
                ? true
                : store.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                store.addressLine
                  .toLowerCase()
                  .includes(inputValue.toLowerCase()) ||
                store.addressCity
                  .toLowerCase()
                  .includes(inputValue.toLowerCase()) ||
                store.addressState
                  .toLowerCase()
                  .includes(inputValue.toLowerCase()) ||
                store.addressCountry
                  .toLowerCase()
                  .includes(inputValue.toLowerCase()) ||
                store.addressZipcode
                  .toLowerCase()
                  .includes(inputValue.toLowerCase());
            })}
            handleItems={null}
            handleSelectedStore={handleSelectedStore}
            handleUpdateStore={handleUpdateStore}
            handleModalOpen={handleStoreModalOpen}
            handleTransferModalOpen={handleTransferItems}
            handleAddingItems={handleAddingItems}
          />
        </FlexboxGridItem>
      </FlexboxGrid>
      <StoreFormModal
        onSubmit={onSubmitUpdateStore}
        isOpen={storeModalIsOpen}
        handleOpen={handleStoreModalOpen}
        newStoreLoading={storeLoading}
        isUpdateStore={isUpdateStore}
        selectedStore={selectedStore}
      />
      <StoreItemsFormModal
        handleOpen={handleAddingItems}
        isOpen={isAddingItems}
        store={selectedStore}
        items={items}
        token={user.token}
      />
      <TransferItemFormModal
        store={selectedStore}
        storeId={selectedStore._id}
        storeItems={items.filter(item => selectedStore?.items?.some((storeItem => storeItem.itemId === item._id)))}
        stores={stores}
        isOpen={isTransferItems}
        handleOpen={handleTransferItems}
        loading={transferLoading}
        onSubmit={onTransferItem}
      />
    </>
  );
}
