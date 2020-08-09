import React, { useContext } from "react";
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

const SIGNUP = gql`
  mutation signup($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
      userId
    }
  }
`;

function SignupForm(props) {
  const [_, setToken] = useLocalStorageState("token");
  const [__, setUserId] = useLocalStorageState("userId");
  const [email, setEmail] = useInputState("sourabh@gmail.com");
  const [password, setPassword] = useInputState("123456");
  const [name, setName] = useInputState("");
  const { setAlert } = useContext(AlertContext);

  const onCompleted = ({ signup }) => {
    const { token, userId } = signup;
    setToken(token);
    setUserId(userId);
    return setAlert(true, "Signed up successfully!", "success");
  };
  const onError = (err) => {
    console.log({err});
    return setAlert(true, err.message, "error");
  };
  const [signup] = useMutation(SIGNUP, { onCompleted, onError });

  const classes = useStyles();

  const submit = (e) => {
    e.preventDefault();
    signup({ variables: { email, password, name } });
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h2">Signup</Typography>
      <div className={classes.formGroup}>
        <TextField
          value={name}
          onChange={setName}
          placeholder="Enter name"
          variant="outlined"
          fullWidth
          label="Name"
        />
      </div>
      <div className={classes.formGroup}>
        <TextField
          value={email}
          onChange={setEmail}
          placeholder="Enter email"
          variant="outlined"
          fullWidth
          label="Email"
        />
      </div>
      <div className={classes.formGroup}>
        <TextField
          value={password}
          onChange={setPassword}
          placeholder="Enter password"
          variant="outlined"
          fullWidth
          label="Password"
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

export default SignupForm;
