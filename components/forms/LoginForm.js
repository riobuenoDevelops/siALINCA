import { useState } from "react";
import {
  Button,
  FlexboxGrid,
  Icon,
  Input,
  InputGroup,
} from "rsuite";
import { useForm } from "react-hook-form";

import FormErrorMessage from "../common/FormErrorMessage";

import "../../styles/forms.less";

const LoginForm = ({ onSubmit, onSubmitAsGuest, loading }) => {
  const { handleSubmit, register, errors } = useForm();
  const [showContent, handleContent] = useState(false);

  const onHandleContent = () => {
    handleContent(!showContent);
  };

  return (
    <form style={{ height: "90%" }} onSubmit={handleSubmit(onSubmit)}>
      <FlexboxGrid
        justify="space-between"
        align="middle"
        className="text-center full-height"
        style={{ padding: "5em 7em 5em 7em" }}
      >
        <FlexboxGrid.Item colspan={24}>
          <h3 className="text-color-primary text-bolder">Iniciar Sesión</h3>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24}>
          <Input
            type="input"
            size="lg"
            name="email"
            placeholder="Correo Electrónico"
            inputRef={register({
              required: true,
              pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
          />
          {errors.email?.type === "required" && <FormErrorMessage message="El campo es requerido" />}
          {errors.email?.type === "pattern" && <FormErrorMessage message="El correo no es valido" />}
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24}>
          <InputGroup inside>
            <Input
              type={!showContent ? "password" : "text"}
              size="lg"
              name="password"
              placeholder="Contraseña"
              inputRef={register({ required: true })}
            />
            <InputGroup.Button
              style={{
                height: "100%",
                width: "4em",
                justifyContent: "center",
              }}
              onClick={onHandleContent}
            >
              <Icon
                style={{ fontSize: "18px" }}
                icon={!showContent ? "eye-slash" : "eye"}
              />
            </InputGroup.Button>
          </InputGroup>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item
          className="text-left"
          colspan={24}
          style={{
            margin: "0px auto",
            display: errors.password?.type === "required" ? "initial" : "none",
          }}
        >
          <div style={{ color: "red" }}>El campo es requerido</div>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={17}>
          <Button
            style={{ paddingRight: 0, textAlign: "end" }}
            block
            type="submit"
            appearance="link"
            className="text-bold text-color-dark-primary"
          >
            ¿Olvidaste tu Contraseña?
          </Button>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24}>
          <Button
            onClick={handleSubmit(onSubmit)}
            block
            appearance="primary"
            className="bg-color-secundary text-bold"
            style={{ padding: "1em 0.7em" }}
            loading={loading}
          >
            Iniciar Sesión
          </Button>
        </FlexboxGrid.Item>
        <FlexboxGrid.Item colspan={24}>
          <Button
            appearance="link"
            className="text-color-dark-gray"
            onClick={onSubmitAsGuest}
          >
            Entrar como invitado
          </Button>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </form>
  );
};

export default LoginForm;
