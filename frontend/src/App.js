import { Button, Alert } from "rsuite"

function App() {
  const onClick = () => {
    Alert.error("There's an error. Try Again", 10000);
  }
  return (
    <div>
      <Button appearance="primary" onClick={onClick}>Registrarse</Button>
    </div>
  );
}

export default App;
