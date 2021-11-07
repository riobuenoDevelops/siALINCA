import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {useForm} from "react-hook-form";
import {Button, FlexboxGrid, Notification} from "rsuite";

import LoadingScreen from "../../components/layouts/LoadingScreen";
import NewDeliveryNoteForm from "../../components/forms/NewDeliveryNoteForm";
import CancelConfirmationModal from "../../components/modals/CancelConfirmationModal";

import AxiosService from "../../services/Axios";
import routes from "../../config/routes";
import {parseCookies} from "../../lib/parseCookies";
import {useApplicants, useSedes, useStores} from "../../hooks";

import "../../styles/forms.less";

export default function NewDeliveryNotePage({ handleLogged, handleUser, user }) {
  const history = useRouter();
  const { handleSubmit, errors, control, register, watch, setError } = useForm();
  const { isLoading: storeLoading, stores } = useStores(user.token);
  const { isLoading: applicantLoading, applicants } = useApplicants(user.token);
  const { isLoading: sedeLoading, sedes } = useSedes(user.token);
  const [isLoading, handleLoading] = useState(false);
  const selectedStoreItems = useState([]);
  const [isOpen, handleIsOpen] = useState(false);

  useEffect(() => {
    if(user) {
      handleLogged(true);
      handleUser(user);
    } else {
      handleLogged(false);
    }
  }, []);

  const onHide = () => {
    handleIsOpen(false);
  };

  const onOpen = () => {
    handleIsOpen(true);
  };

  const onConfirmCancel = () => {
    history.push("/notes");
  };

  const onSubmit = async (data) => {
    handleLoading(true);
    if(!selectedStoreItems[0].length){
      setError("storeItems",
        {
          type: "empty",
          message: "Debe agregar por lo menos un item a la nota",
          shouldFocus: false
        })
      handleLoading(false);
      return;
    }

    const noteData = {
      createStamp: data.createStamp,
      returnStamp: data.returnStamp,
      noteType: data.noteType,
      applicantType: data.applicantType,
      applicantId: data.applicantId,
      items: selectedStoreItems[0].map(item => ({
        storeId: item.storeId,
        itemId: item.itemId,
        quantity: item.quantity
      })),
      generatePDF: data.generatePDF
    }

    try {
      await AxiosService.instance.post(
        routes.notes,
        noteData,
        {
          headers: {
            Authorization: user.token,
          },
        }
      );

      selectedStoreItems[0].map(async (item) => {
        const store = stores.filter(store => store._id === item.storeId)[0];
        const savedItemInStore = store.items.filter(savedItem => savedItem.itemId === item.itemId)[0];

        await AxiosService.instance.put(
          `${routes.getStores}/${item.storeId}/items` ,
          store.items.map(savedItem => {
            if(savedItem.itemId === item.itemId) {
              return {
                quantity: savedItemInStore.quantity - item.quantity,
                itemId: item.itemId
              }
            }
            return savedItem;
          }),
          {
            headers: {
              Authorization: user.token,
            },
          }
        );

        await AxiosService.instance.put(
          `${routes.items}/${item.itemId}` ,
          {
            quantity: savedItemInStore.quantity - item.quantity
          },
          {
            headers: {
              Authorization: user.token,
            },
          }
        );
      })

      Notification.success({
        title: "Nueva nota de Entrega creada",
        placement: "bottomStart",
        duration: 9000,
      });
      handleLoading(false);
      history.push("/notes");
    } catch (err){
      Notification.error({
        title: "Error",
        description: err?.message,
        placement: "bottomStart",
        duration: 9000,
      });
      handleLoading(false);
    }
  };

  if(storeLoading && applicantLoading && sedeLoading) return <LoadingScreen />;

  return (
    <>
      <FlexboxGrid justify="space-between" className="form">
        <FlexboxGrid.Item colspan={24}>
          <h3 className="text-bolder">Nueva Nota de Entrega</h3>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24}>
          <NewDeliveryNoteForm
            applicants={applicants}
            stores={stores}
            sedes={sedes}
            control={control}
            register={register}
            errors={errors}
            watch={watch}
            token={user.token}
            selectedStoreItems={selectedStoreItems}
          />
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={15} />
        <FlexboxGrid.Item
          colspan={4}
          style={{ marginBottom: "2rem", marginTop: "2rem" }}
        >
          <Button
            block
            appearance="default"
            className="button shadow bg-color-white text-medium text-black"
            onClick={onOpen}
          >
            Cancelar
          </Button>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item
          colspan={4}
          style={{ marginBottom: "2rem", marginTop: "2rem" }}
        >
          <Button
            block
            className="button shadow text-medium bg-color-primary text-white"
            onClick={handleSubmit(onSubmit)}
            loading={isLoading}
            appearance="primary"
          >
            Finalizar
          </Button>
        </FlexboxGrid.Item>
      </FlexboxGrid>
      <CancelConfirmationModal
        isOpen={isOpen}
        onHide={onHide}
        onHandleCloseConfirmationModal={onConfirmCancel}
        handleOpen={handleIsOpen}
      />
    </>
  )
}

export async function getServerSideProps({ req }) {
  let user = {};
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