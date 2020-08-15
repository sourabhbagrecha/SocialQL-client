import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { AlertContext } from "../contexts/Alert.context";
import { UserContext } from "../contexts/User.context";
import Navigation from "./Navigation";

function Layout(props) {
  const {setGlobalToken} = props;
  const history = useHistory();
  const { alertOpen, handleAlertClose, alertType, alertMsg } = useContext(
    AlertContext
  );
  const {
    fetchLocalUser,
    state: {
      token
    }
  } = useContext(UserContext);

  const [localSavedUserId] = useLocalStorageState("userId");
  const [localSavedToken] = useLocalStorageState("token");

  useEffect(() => {
    if(localSavedToken && localSavedUserId){
      fetchLocalUser({
        userId: localSavedUserId,
        token: localSavedToken
      });
    } else {
      history.push("/login")
    }
  }, []);

  useEffect(() => {
    setGlobalToken(token);
  }, [token])

  return (
    <>
      <Navigation
        localSavedToken={localSavedToken}
      />
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
