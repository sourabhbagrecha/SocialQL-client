import React from "react";
import Layout from "./pages/Layout.page";
import { AlertProvider } from "./contexts/Alert.context";
import { UserProvider } from "./contexts/User.context";

function App() {
  return (
    <AlertProvider>
      <UserProvider>
        <Layout/>
      </UserProvider>
    </AlertProvider>
  );
}

export default App;
