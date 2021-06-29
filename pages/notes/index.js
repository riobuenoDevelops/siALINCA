import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlexboxGrid } from "rsuite";

import LoadingScreen from "../../components/layouts/LoadingScreen";
import SearchInput from "../../components/Search/SearchInput";
import NotesTable from "../../components/tables/NotesTable";

import { parseCookies } from "../../lib/parseCookies";
import { useNotes } from "../../hooks"

const NotesPage = ({handleLogged, handleUser, user}) => {
  const { t } = useTranslation();
  const { notes, isLoading, isError } = useNotes(user.token, {});
  const [searchInput, setSearchInput] = useState("");


  useEffect(() => {
    handleLogged(true);
    handleUser(user);
  }, []);

  if (isLoading) return <LoadingScreen/>

  return <FlexboxGrid>
    <FlexboxGrid.Item colspan={16}>
      <h2 className="text-bolder">Notas de Entrega ({t(`roles.${user.user.roleName}`)})</h2>
    </FlexboxGrid.Item>
    <FlexboxGrid.Item colspan={8} style={{marginBottom: "2rem"}}>
      <SearchInput
        value={searchInput}
        data={notes}
        handleValue={setSearchInput}
        placehoderLabel="Nota"
      />
    </FlexboxGrid.Item>
    <FlexboxGrid.Item colspan={24}>
      <NotesTable
        notes={notes}
        searchInputValue={searchInput}
        token={user.token}
      />
    </FlexboxGrid.Item>
  </FlexboxGrid>;
};

export async function getServerSideProps({req}) {
  const cookies = parseCookies(req);

  if (cookies && cookies.sialincaUser) {
    try {
      const user = JSON.parse(cookies.sialincaUser);

      return {
        props: {
          user,
          isError: false,
        },
      };
    } catch (err) {
      return {
        props: {
          isError: true,
        },
      };
    }
  }

  return {
    props: {},
    redirect: {
      permanent: false,
      destination: "/login"
    }
  }
}

export default NotesPage;
