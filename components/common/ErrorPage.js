import Lottie from 'react-lottie';
import animationData from '../../public/lotties/error-500.json';
import {Button, Container, Content } from "rsuite";
import {useRouter} from "next/router";

export default function ErrorPage() {
  const lottieConfig = {
    loop: true,
    autoplay: false,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };
  const router = useRouter();

  const onReload = () => {
    router.push(router.asPath);
  }

  return (
    <Container>
      <Content>
        <Lottie options={lottieConfig} width={400} height={400} />
        <h5>Ha ocurrido un error. Recargue la página</h5>
        <Button
          appearance="primary"
          onClick={onReload}
        >
          Recargar pagina
        </Button>
      </Content>
    </Container>
  )
}