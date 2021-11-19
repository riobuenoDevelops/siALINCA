import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { FlexboxGrid, Notification } from 'rsuite';

import LoadingScreen from '../../components/layouts/LoadingScreen';
import BackButton from '../../components/common/BackButton';
import BasicActionsButtonGroup from '../../components/customComponents/BasicActionsButtonGroup';
import ItemStoreTable from '../../components/tables/ItemStoreTable';
import MedicineDetailRow from '../../components/customComponents/items/MedicineDetailRow';
import MealDetailRow from '../../components/customComponents/items/MealDetalRow';
import EnamelwareDetailRow from '../../components/customComponents/items/EnamelwareDetailRow';
import ElectroDeviceDetailRow from '../../components/customComponents/items/ElectroDeviceDetailRow';
import StationaryDetailRow from '../../components/customComponents/items/StationaryDetailRow';
import PropertyDetailRow from '../../components/customComponents/items/PropertyDetailRow';
import DeleteConfirmationModal from '../../components/modals/DeleteConfirmationModal';
import NotesTable from '../../components/tables/NotesTable';
import ErrorPage from '../../components/common/ErrorPage';

import { useItem, useStores, useUser, useNotesByItem, useCurrentUser } from '../../hooks';
import AxiosService from '../../services/Axios';
import routes from '../../config/routes';
import NewDeviceCharacteristicsTable from '../../components/tables/NewDeviceCharacteristicsTable';

export default function ItemDetailPage({ user, handleLogged }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const [changesLoading, setLoading] = useState(false);
  const [isOpen, handleOpen] = useState(false);
  const { isEmpty } = useCurrentUser();
  const { item, itemStores, isLoading, itemMutate } = useItem(user?.token, id ? id : null);
  const { stores, isLoading: storeLoading } = useStores(user?.token);
  const { user: { names, lastNames }, isLoading: userLoading } = useUser(item?.userId, user?.token);
  const { itemNotes, isLoading: noteLoading } = useNotesByItem(user?.user.roleName !== "guest" ? id : null, user?.token);

  useEffect(() => {
    if (isEmpty) {
      router.push('/login');
    }

    handleLogged(true);
  }, []);

  const getDetailRow = (type) => {
    switch (type) {
      case 'medicine':
        return <MedicineDetailRow data={{ ...item, userName: `${names} ${lastNames}` }}/>;
      case 'meal':
        return <MealDetailRow data={{ ...item, userName: `${names} ${lastNames}` }}/>;
      case 'enamelware':
        return <EnamelwareDetailRow data={{ ...item, userName: `${names} ${lastNames}` }}/>;
      case 'electroDevice':
        return <ElectroDeviceDetailRow data={{ ...item, userName: `${names} ${lastNames}` }}/>;
      case 'stationary':
        return <StationaryDetailRow data={{ ...item, userName: `${names} ${lastNames}` }}/>;
      case 'property':
        return <PropertyDetailRow data={{ ...item, userName: `${names} ${lastNames}` }}/>;
    }
    return null;
  };

  const onEdit = (type) => {
    switch (type) {
      case 'medicine':
        router.push({
          pathname: '/items/new-medicine',
          query: {
            id: item.itemId,
            childId: item._id
          }
        });
        break;
      case 'meal':
        router.push({
          pathname: '/items/new-meal',
          query: {
            id: item.itemId,
            childId: item._id
          }
        });
        break;
      case 'enamelware':
        router.push({
          pathname: '/items/new-enamelware',
          query: {
            id: item.itemId,
            childId: item._id
          }
        });
        break;
      case 'electroDevice':
        router.push({
          pathname: '/items/new-electronic-device',
          query: {
            id: item.itemId,
            childId: item._id
          }
        });
        break;
      case 'stationary':
        router.push({
          pathname: '/items/new-stationary',
          query: {
            id: item.itemId,
            childId: item._id
          }
        });
        break;
      case 'property':
        router.push({
          pathname: '/items/new-property',
          query: {
            id: item.itemId,
            childId: item._id
          }
        });
        break;
    }
  };

  const getSubItemRoute = (type) => {
    switch (type) {
      case 'medicine':
        return 'medicines';
      case 'meal':
        return 'meals';
      case 'enamelware':
        return 'enamelware';
      case 'electroDevice':
        return 'electro-devices';
      case 'stationary':
        return 'stationary';
      case 'property':
        return 'properties';
    }
  };

  const onDelete = async () => {
    setLoading(true);
    try {
      const filteredStores = stores?.filter(store => {
        return store.items.some((storeItem) => {
          return storeItem.itemId === item.itemId;
        });
      });

      for (let i = 0; i < filteredStores.length; i++) {
        const newStoreItems = filteredStores[i].items.filter(storeItem => (storeItem.itemId !== item.itemId)) || [];

        await AxiosService.instance.put(`${routes.getStores}/${filteredStores[i]._id}/items`, newStoreItems, {
          headers: {
            Authorization: user.token
          }
        });
      }

      await AxiosService.instance.delete(
        `${routes.items}/${getSubItemRoute(item.type)}/${item._id}`, {
          headers: {
            Authorization: user.token
          }
        });

      Notification.success({
        title: 'Elemento Eliminado',
        description: `El item ${item?.name} ha sido eliminado exitosamente`,
        duration: 9000,
        placement: 'bottomStart'
      });
      await mutate();
      router.push('/items');
    } catch (err) {
      Notification.error({
        title: 'Error',
        description: err?.message,
        duration: 9000,
        placement: 'bottomStart'
      });
    }
  };

  if (isLoading || userLoading || changesLoading || storeLoading || (user?.user.roleName !== "guest" && noteLoading)) return <LoadingScreen/>;

  return (
    <>
      <FlexboxGrid justify="space-between">
        <FlexboxGrid.Item colspan={1}>
          <BackButton route="items" placeholder="Inventario"/>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={user?.user.roleName !== "guest" ? 20 : 23}>
          <h2 className="text-bolder text-black">{item?.name}</h2>
        </FlexboxGrid.Item>
        {user?.user.roleName !== "guest" &&
          <FlexboxGrid.Item colspan={3} className="responsive-box">
            <BasicActionsButtonGroup
              itemMutate={itemMutate}
              disabled={item?.disabled}
              onEdit={() => onEdit(item?.type)}
              onDelete={() => handleOpen(true)}
              route={`/items/${id}`}
              token={user.token}
            />
          </FlexboxGrid.Item>
        }
        <FlexboxGrid.Item colspan={24} style={{ marginTop: '2rem' }}>
          <div className="info-box shadow">
            <h4 className="text-bolder text-color-primary">Características del recurso</h4>
            <FlexboxGrid justify="space-between" className="info">
              <FlexboxGrid.Item style={{ marginRight: '1rem' }}>
                <span>Código</span>
                <p>{item?.itemId}</p>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item style={{ marginRight: '1rem' }}>
                <span>Tipo</span>
                <p>{t(`categories.${item?.type}`)}</p>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item style={{ marginRight: '1rem' }}>
                <span>Precio</span>
                <p>{item?.price}</p>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item style={{ marginRight: '1rem' }}>
                <span>Estado</span>
                <p style={{ color: item?.disabled ? 'red' : 'green' }}>{item?.disabled ? 'Inactivo' : 'Activo'}</p>
              </FlexboxGrid.Item>
              {getDetailRow(item?.type)}
            </FlexboxGrid>
          </div>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={item?.type === "electroDevice" ? 12 : 24} style={{ marginTop: '2rem' }}>
          <div className="info-box shadow">
            <FlexboxGrid justify="space-between">
              <FlexboxGrid.Item colspan={5}>
                <h4 className="text-bolder text-color-primary">Almacenamiento</h4>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={8} style={{ marginBottom: '1rem' }}>
                <h5 className="text-bolder text-right">Total: {item?.quantity}</h5>
                <p className="text-bold text-right">Cantidad por unidad: {item?.unitQuantity}</p>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item colspan={24}>
                <ItemStoreTable data={itemStores}/>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </div>
        </FlexboxGrid.Item>
        {item?.type === "electroDevice" &&
          <FlexboxGrid.Item colspan={11} style={{ marginTop: '2rem',  marginBottom: '2rem' }}>
            <div className="info-box shadow">
              <div style={{ marginBottom: "0.5rem" }}>
                <h4 className="text-bolder text-color-primary">Características</h4>
              </div>
              <NewDeviceCharacteristicsTable data={item?.characteristics} withoutAction />
            </div>
          </FlexboxGrid.Item>
        }
        {user?.user.roleName !== "guest" &&
          <FlexboxGrid.Item colspan={24}>
            <h4 className="text-bolder" style={{ margin: '1rem 0' }}>Notas de Entrega</h4>
            <NotesTable
              notes={itemNotes}
              searchInputValue=""
              token={user?.user.roleName !== "guest" ? user.token : null}
              readOnly
            />
          </FlexboxGrid.Item>
        }
      </FlexboxGrid>
      <DeleteConfirmationModal isOpen={isOpen} onDelete={onDelete} handleOpen={handleOpen}/>
    </>
  );
}
