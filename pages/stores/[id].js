import {useEffect, useState} from "react";
import { useRouter } from "next/router";
import {
  Button,
  FlexboxGrid,
  Icon,
  IconButton,
  Input,
  SelectPicker,
  Tooltip,
  Whisper,
  Notification,
  Nav
} from "rsuite";
import {useForm, Controller} from "react-hook-form";
import { parseCookies } from "../../lib/parseCookies";
import StoreService from "../../services/Store";
import ItemsService from "../../services/Item"
import AxiosService from "../../services/Axios"
import routes from "../../config/routes";
import Crc from "country-state-city";


import StoreItemsTable from "../../components/tables/StoreItemsTable";
import StoreFormModal from "../../components/modals/StoreFormModal";
import BasicActionsButtonGroup from "../../components/customComponents/BasicActionsButtonGroup";

import "../../styles/custom-theme.less";
import "../../styles/forms.less";

const StoreDetailPage = ({handleUser, handleLogged, user, store, items, isError}) => {
  const router = useRouter();
  const storeItemForm = useForm();
  const [isAdding, handleAdding] = useState(false);
  const [isEditingItem, handleEditingItem] = useState(false);
  const [isEditingStore, handleEditingStore] = useState(false);
  const [isModalOpen, handleIsModalOpen] = useState(false);
  const [isLoading, handleLoading] = useState(false);
  
  useEffect(() => {
    if(isError){
      router.push("/500");
    }
    handleUser(user);
    handleLogged(true);
  }, [])
  
  const onBack = () => {
    router.push("/stores");
  }
  
  const onAdd = () => {
    handleAdding(true);
  }
  
  const onExitAdd = () => {
    handleAdding(false);
  }
  
  const onEdit = () => {
    handleIsModalOpen(true);
  }
  
  const onEditStore = async (data) => {
    handleLoading(true)
    try{
      await AxiosService.instance.put(routes.getStores+`/${store._id}`, data, {
        headers:{
          Authorization: user.token
        }
      });
      Notification.success({title: "Almacén actualizado", placement: "topEnd", duration: 9000, description: `El almacén ha sido actualizado`});
      router.push(router.asPath);
    }catch (err){
      console.error(err.response.data.message);
    }
    handleLoading(false);
    handleIsModalOpen(false);
  }
  
  const onSubmitEditStoreItems = async (data) => {
    const storeItemData = {
      itemId: data.itemId,
      quantity: data.quantity
    };
    
    try {
      if(isEditingItem) {
        await AxiosService.instance.put(routes.getStores + `/${store._id}`, {...store, items: [...store.items, storeItemData]}, {
          headers:{
            Authorization: user.token
          }
        });
      } else {
        await AxiosService.instance.post(routes.getStores + `/${store._id}/items`, [storeItemData], {
          headers:{
            Authorization: user.token
          }
        });
      }
      Notification.success({title: isEditingItem ? "Item actualizado" : "Item agregado", placement: "topEnd", duration: 9000, description: `El item ${storeItemData.itemId} ha sido ${isEditingItem ? "actualizado para" : "agregado al"} almacén ${store.name}`});
      router.push(router.asPath);
    }catch (err) {
      console.error(err.response.data.message);
    }
    handleEditingItem(false);
  }
  
  return <>
    <FlexboxGrid>
      <FlexboxGrid.Item colspan={1}>
        <Whisper placement="bottom" trigger="hover" speaker={<Tooltip>A Almacenes</Tooltip>}>
          <IconButton style={{margin: "0.3rem 0"}} size="sm" icon={<Icon className="text-white" icon="angle-left" />} appearance="primary" className="bg-color-secundary" circle onClick={onBack} />
        </Whisper>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={20}>
        <h2 className="text-bolder">{store.name}</h2>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={3} className="responsive-box">
        <BasicActionsButtonGroup disabled={store.disabled} onEdit={onEdit} onDelete={null} onEnableDisable={null} />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={24} style={{marginTop: "2rem"}}>
        <div className="info-box shadow">
          <h4 className="text-color-primary text-bolder">Información General</h4>
          <FlexboxGrid justify="space-between" className="info">
            <FlexboxGrid.Item>
              <span>Dirección</span>
              <p>{store.addressLine}</p>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={1} />
            <FlexboxGrid.Item>
              <span>Ciudad</span>
              <p>{store.addressCity}</p>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={1} />
            <FlexboxGrid.Item>
              <span>Estado</span>
              <p>{Crc.getStatesOfCountry(store.addressCountry).filter(state => state.isoCode === store.addressState)[0].name}</p>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={1} />
            <FlexboxGrid.Item>
              <span>Pais</span>
              <p>{Crc.getCountryByCode(store.addressCountry).name}</p>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={1} />
            <FlexboxGrid.Item>
              <span>Código Postal</span>
              <p>{store.addressZipcode}</p>
            </FlexboxGrid.Item>
            <FlexboxGrid.Item colspan={1} />
            <FlexboxGrid.Item>
              <span>Estado</span>
              <p>{store.disabled ? "Inactivo" : "Activo"}</p>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </div>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={24} style={{marginTop: "2rem"}} className="info-box shadow">
        <FlexboxGrid>
          <FlexboxGrid.Item colspan={22}>
            <h4 className="text-color-primary text-bolder">Items en Almacén</h4>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={2} className="responsive-box" style={{marginBottom: isAdding? "initial" : "1rem"}}>
            <Whisper placement="bottomEnd" trigger="hover" speaker={<Tooltip>{isAdding ? "Salir de Agregar Items" : "Agregar Items"}</Tooltip>}>
              <IconButton circle size="sm" className="bg-default" icon={<Icon icon={isAdding ? "exit" : "plus"} />} onClick={isAdding ? onExitAdd : onAdd} />
            </Whisper>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={24} style={{margin: "1rem 0", display: isAdding ? "initial" : "none"}} className="form">
            <FlexboxGrid>
              <FlexboxGrid.Item colspan={4}>
                <span className="input-title">Item</span>
                <Controller name="item" defaultValue="" control={storeItemForm.control} rules={{required: true}} render={(field) => (
                  <SelectPicker {...field} data={items} className="select-dropdown with-shadow" labelKey="name" valueKey="_id" />
                )} />
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={1} />
              <FlexboxGrid.Item colspan={4}>
                <span className="input-title">Cantidad</span>
                <Input name="quantity" size="lg" className="with-shadow" placeholder={0} inputRef={storeItemForm.register({required: true})} type="number" />
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={1} />
              <FlexboxGrid.Item colspan={2} style={{paddingTop: "1.3rem"}}>
                <span className="input-title">{" "}</span>
                <Button className="button bg-color-secundary text-medium shadow" block appearance="primary" onClick={storeItemForm.handleSubmit(onSubmitEditStoreItems)}>Agregar</Button>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={24}>
            <StoreItemsTable items={store.items} />
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={24} style={{margin: "2rem 0"}}>
        <h4 className="text-bolder">Ordenes de Entrega</h4>
      </FlexboxGrid.Item>
    </FlexboxGrid>
    <StoreFormModal onSubmit={onEditStore} handleOpen={handleIsModalOpen} isOpen={isModalOpen} newStoreLoading={isLoading} isUpdateStore={true} selectedStore={store} />
  </>
}

export async function getServerSideProps({req, params}){
  let user, store = {}, storeItems = [], items = [];
  const cookie = parseCookies(req);
  
  if(cookie && cookie.sialincaUser){
    user = JSON.parse(cookie.sialincaUser);
    
    try {
      store = await StoreService.getStore({id: params.id});
      storeItems = await StoreService.getStoreItems({ids: store.items.map(item => item.itemId)});
      
      store = {...store, _id: store._id.toString(), items: storeItems.map((item) => ({...item, _id: item._id.toString()})) };
  
      items = await ItemsService.getItems({disabled: false});
      items = items.map(item => ({...item, _id: item._id.toString()})).filter((item) => {
        if(!store.items.some((storeItem) => storeItem._id === item._id)){
          return item;
        }
      });
      
      return {
        props: {
          user,
          isError: false,
          store,
          items
        }
      }
      
    }catch (err) {
      return {
        props: {
          user,
          isError: true,
          store,
          items
        }
      }
    }
  }
  
  return {
    redirect: {
      permanent: false,
      destination: "/login"
    },
    props: {}
  }
}

export default StoreDetailPage;