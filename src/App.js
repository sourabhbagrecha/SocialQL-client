import React from "react";
import Layout from "./pages/Layout.page";
import { AlertProvider } from "./contexts/Alert.context";
import { UserProvider } from "./contexts/User.context";

function App(props) {
  const { setGlobalToken } = props;
  return (
    <AlertProvider>
      <UserProvider>
        <Layout setGlobalToken={setGlobalToken} />
      </UserProvider>
    </AlertProvider>
  );
}

export default App;
