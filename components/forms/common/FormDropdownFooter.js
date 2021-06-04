import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useState } from "react";
import AxiosService from "../../../services/Axios";
import routes from "../../../config/routes";
import { Button, Divider, FlexboxGrid, Input } from "rsuite";

export default function FormDrowpdownFooter({
  route,
  placeholder,
  isEditing,
  setEditing,
  token,
}) {
  const router = useRouter();
  const { handleSubmit, errors, register } = useForm();
  const [isLoading, handleLoading] = useState(false);

  const onSubmit = async (data) => {
    handleLoading(true);
    try {
      await AxiosService.instance.post(
        routes.getMeasures + `/${route}`,
        { name: data.item },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      router.replace(router.asPath);
    } catch (err) {
      console.error(err.response.data.message);
    }
    handleLoading(false);
    setEditing(false);
  };

  return (
    <div style={{ padding: "0 0.5rem 0.5rem 0.5rem" }}>
      <Divider style={{ margin: "0 0 0.5rem 0" }} />
      {isEditing ? (
        <FlexboxGrid className="form">
          <FlexboxGrid.Item colspan={24} style={{ marginBottom: "0.5em" }}>
            <span className="input-title">Nombre</span>
            <Input
              name="item"
              className="secundary-input"
              size="sm"
              placeholder="Nombre del item"
              applearance="subtle"
              style={{ fontSize: "14px" }}
              inputRef={register({ required: true })}
            />
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={24}>
            <Button
              appearance="primary"
              className="text-white text-medium bg-color-dark-primary"
              block
              loading={isLoading}
              onClick={handleSubmit(onSubmit)}
            >
              Agregar
            </Button>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      ) : (
        <Button
          appearance="primary"
          className="bg-color-secundary text-white text-medium"
          block
          onClick={() => setEditing(true)}
        >
          Agregar {placeholder}
        </Button>
      )}
    </div>
  );
}
