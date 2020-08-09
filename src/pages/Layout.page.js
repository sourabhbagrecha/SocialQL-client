import React, { useContext, useEffect } from "react";
import Login from "./Login.page";
import Signup from "./Signup.page";
import { Route, Switch } from "react-router-dom";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { AlertContext } from "../contexts/Alert.context";
import People from "./People.page";
import Home from "./Home.page";
import { UserContext } from "../contexts/User.context";

function Layout(props) {
  const [token] = useLocalStorageState("token");
  const { alertOpen, handleAlertClose, alertType, alertMsg } = useContext(
    AlertContext
  );
  const {
    fetchLocalUser
  } = useContext(UserContext);

  const [localSavedUserId] = useLocalStorageState("userId");
  const [localSavedToken] = useLocalStorageState("token");

  useEffect(() => {
    fetchLocalUser({
      userId: localSavedUserId,
      token: localSavedToken
    })
  }, []);

  const routes = [
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/signup",
      component: Signup,
    },
    {
      path: "/",
      exact: true,
      component: Home,
      authRequired: true,
    },
    {
      path: "/people",
      exact: true,
      component: People,
      authRequired: true,
    },
  ];

  const routeRender = (route) => {
    if (!route.authRequired) {
      return <Route {...route} />;
    } else {
      if (token) {
        return <Route {...route} />;
      }
    }
  };

  return (
    <>
      <Switch>{routes.map(routeRender)}</Switch>
      <Snackbar
        open={alertOpen}
        autoHideDuration={5000}
        onClose={handleAlertClose}
      >
        <Alert variant="filled" onClose={handleAlertClose} severity={alertType}>
          {alertMsg}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Layout;
