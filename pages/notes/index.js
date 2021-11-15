import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { FlexboxGrid } from "rsuite";

import LoadingScreen from "../../components/layouts/LoadingScreen";
import NotesTable from "../../components/tables/NotesTable";

import { useCurrentUser, useItems, useNotes, useStores } from '../../hooks';

export default function NotesPage ({ handleLogged, user }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { isEmpty } = useCurrentUser();
  const { stores, isLoading: storesLoading } = useStores(user?.token);
  const { items, isLoading: itemsLoading } = useItems(user?.token);
  const { notes, isLoading } = useNotes(user?.token, {});

  useEffect(() => {
    if (isEmpty) {
      router.push('/login');
    }

    handleLogged(true);

  }, []);

  if (isLoading || itemsLoading || storesLoading) return <LoadingScreen/>

  return <FlexboxGrid>
    <FlexboxGrid.Item colspan={16}>
      <h2 className="text-bolder">Notas de Entrega ({t(`roles.${user?.user.roleName}`)})</h2>
    </FlexboxGrid.Item>
    <FlexboxGrid.Item colspan={24}>
      <NotesTable
        notes={notes}
        stores={stores}
        items={items}
        token={user?.token}
      />
    </FlexboxGrid.Item>
  </FlexboxGrid>
}
