import {
  Button,
  Checkbox,
  ErrorMessage,
  FlexboxGrid,
  Icon,
  Input,
  InputGroup,
  Message,
} from "rsuite";
import FlexboxGridItem from "rsuite/lib/FlexboxGrid/FlexboxGridItem";
import { useForm } from "react-hook-form";

import "../../styles/login-form.less";
import { useState } from "react";

const LoginForm = ({ onSubmit, errorMessage }) => {
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
        <FlexboxGridItem colspan={24}>
          <h3 className="text-color-primary text-bolder">Iniciar Sesión</h3>
        </FlexboxGridItem>
        <FlexboxGridItem colspan={24}>
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
        </FlexboxGridItem>
        <FlexboxGridItem
          className="text-left"
          colspan={24}
          style={{
            margin: "0px auto auto auto",
            display: errors.email?.type === "required" ? "initial" : "none",
          }}
        >
          <div style={{ color: "Red" }}>El campo es requerido</div>
        </FlexboxGridItem>
        <FlexboxGridItem
          className="text-left"
          colspan={24}
          style={{
            margin: "0px auto auto auto",
            display: errors.email?.type === "pattern" ? "initial" : "none",
          }}
        >
          <div style={{ color: "Red" }}>Introduzca un correo válido</div>
        </FlexboxGridItem>
        <FlexboxGridItem colspan={24}>
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
        </FlexboxGridItem>
        <FlexboxGridItem
          className="text-left"
          colspan={24}
          style={{
            margin: "0px auto",
            display: errors.password?.type === "required" ? "initial" : "none",
          }}
        >
          <div style={{ color: "red" }}>El campo es requerido</div>
        </FlexboxGridItem>
        <FlexboxGridItem colspan={7} style={{ textAlign: "start" }}>
          <Checkbox name="rememberme" title="Recuérdame" inputRef={register()}>
            Recuérdame
          </Checkbox>
        </FlexboxGridItem>
        <FlexboxGridItem colspan={17}>
          <Button
            style={{ paddingRight: 0, textAlign: "end" }}
            block
            type="submit"
            appearance="link"
            className="text-bold text-color-dark-primary"
          >
            ¿Olvidaste tu Contraseña?
          </Button>
        </FlexboxGridItem>
        <FlexboxGridItem colspan={24}>
          <Button
            onClick={handleSubmit(onSubmit)}
            block
            appearance="primary"
            className="bg-color-secundary text-bold"
            style={{ padding: "1em 0.7em" }}
          >
            Iniciar Sesión
          </Button>
        </FlexboxGridItem>
        <FlexboxGridItem colspan={24}>
          <Button appearance="link" className="text-color-dark-gray">
            Entrar como invitado
          </Button>
        </FlexboxGridItem>
      </FlexboxGrid>
    </form>
  );
};

export default LoginForm;
