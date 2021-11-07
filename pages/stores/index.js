import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { FlexboxGrid, Notification } from "rsuite";
import FlexboxGridItem from "rsuite/lib/FlexboxGrid/FlexboxGridItem";

import SearchInput from "../../components/Search/SearchInput";
import StoresTable from "../../components/tables/StoresTable";
import StoreFormModal from "../../components/modals/StoreFormModal";
import StoreItemsFormModal from "../../components/modals/StoreItemsFormModal";

import { parseCookies } from "../../lib/parseCookies";
import AxiosService from "../../services/Axios";
import routes from "../../config/routes";
import {useItems, useStores} from "../../hooks";
import LoadingScreen from "../../components/layouts/LoadingScreen";

const StorePage = ({
  handleLogged,
  handleUser,
  user,
  storeModalIsOpen,
  handleStoreModalOpen,
  isError,
}) => {
  const history = useRouter();
  const { i18n } = useTranslation();
  const { stores, isLoading: storesLoading, mutate } = useStores(user.token);
  const { items, isLoading: itemsLoading } = useItems(user.token);
  const [inputValue, handleInputValue] = useState("");
  const [storeLoading, handleStoreLoading] = useState(false);
  const [isUpdateStore, handleUpdateStore] = useState(false);
  const [isAddingItems, handleAddingItems] = useState(false);
  const [selectedStore, handleSelectedStore] = useState({});

  useEffect(() => {
    if (isError) {
      handleLogged(false);
    } else {
      handleLogged(true);
      handleUser(user);
    }
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

  const onHandleInputValue = (value) => {
    handleInputValue(value);
  };

  if(storesLoading || itemsLoading) return <LoadingScreen />;

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
    </>
  );
};

export async function getServerSideProps({ req }) {
  let user = null;
  const cookies = parseCookies(req);
  if (cookies && cookies.sialincaUser) {
    user = JSON.parse(cookies.sialincaUser);

    return {
      props: {
        user,
        isError: false,
      },
    };
  }

  return {
    redirect: {
      permanent: false,
      destination: "/login",
    },
    props: {},
  };
}

export default StorePage;
