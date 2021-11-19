import electron from 'electron';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlexboxGrid, Notification } from 'rsuite';
import { useRouter } from 'next/router';

import LoadingScreen from '../../components/layouts/LoadingScreen';
import SearchInput from '../../components/Search/SearchInput';
import ItemsTable from '../../components/tables/ItemsTable';

import AxiosService from '../../services/Axios';
import { useItems, useCurrentUser } from '../../hooks';

const ipcRenderer = electron.ipcRenderer || false;

export default function ItemsPage({ handleLogged }) {
  const router = useRouter();
  const { i18n } = useTranslation();
  const { isEmpty, user } = useCurrentUser();
  const { items, isLoading, mutate } = useItems(user?.token, user?.user.userConfig.nivelInventario);
  const [searchInputValue, handleSearchInputValue] = useState('');

  useEffect(() => {
    if (isEmpty) {
      router.push('/login');
    }

    handleLogged(true);

    ipcRenderer.on('dirInventoryPDF', async (event, data) => {
      await onGeneratePDF(data);
    });
  }, []);

  const onGeneratePDF = async (path) => {
    try {
      await AxiosService.instance.post('/items/report', { path }, {
        headers: {
          Authorization: user.token
        }
      });

      Notification.success({
        title: "Éxito",
        description: "El PDF se ha generado correctamente",
        duration: 5000,
        placement: "bottomStart"
      });
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) return <LoadingScreen/>;

  return (
    <FlexboxGrid>
      <FlexboxGrid.Item colspan={16} style={{ paddingBottom: '2em' }}>
        <h2 className="text-black text-bolder">
          Inventario ({i18n.t(`roles.${user?.user?.roleName}`)})
        </h2>
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={8}>
        <SearchInput
          placehoderLabel="insumo"
          handleValue={handleSearchInputValue}
          value={searchInputValue}
        />
      </FlexboxGrid.Item>
      <FlexboxGrid.Item colspan={24}>
        <ItemsTable
          role={user.user.roleName}
          items={user.user.roleName !== 'guest' ? items : items.filter((item) => !item.isDeleted)}
          searchInputValue={searchInputValue}
          mutate={mutate}/>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
}
