import React, { useState, useContext } from "react";
import { gql, useMutation } from "@apollo/client";
import {
  TextField,
  Typography,
  Button,
  Container,
  makeStyles,
} from "@material-ui/core";
import useInputState from "../hooks/useInputState";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { AlertContext } from "../contexts/Alert.context";

const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      userId
    }
  }
`;

function LoginForm(props) {
  const [_, setToken] = useLocalStorageState("token");
  const [__, setUserId] = useLocalStorageState("userId");
  const [email, setEmail] = useInputState("sourabh@gmail.com");
  const [password, setPassword] = useInputState("123456");
  const { setAlert } = useContext(AlertContext);

  const onCompleted = ({ login }) => {
    const { token, userId } = login;
    setToken(token);
    setUserId(userId);
    return setAlert(true, "Login up successfully!", "success");
  };
  const onError = (err) => {
    console.log({err});
    return setAlert(true, err.message, "error");
  };
  const [login] = useMutation(LOGIN, { onCompleted, onError });

  const classes = useStyles();

  const submit = (e) => {
    e.preventDefault();
    login({ variables: { email, password } });
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h2">Login</Typography>
      <div className={classes.formGroup}>
        <TextField
          value={email}
          onChange={setEmail}
          placeholder="Enter email"
          variant="outlined"
          fullWidth
        />
      </div>
      <div className={classes.formGroup}>
        <TextField
          value={password}
          onChange={setPassword}
          placeholder="Enter password"
          variant="outlined"
          fullWidth
        />
      </div>
      <div className={classes.formButton}>
        <Button variant="outlined" fullWidth color="primary" onClick={submit}>
          Submit
        </Button>
      </div>
    </Container>
  );
}

const useStyles = makeStyles({
  formGroup: {
    margin: "10px",
  },
  formButton: {
    width: "50%",
    margin: "auto",
  },
});

export default LoginForm;
