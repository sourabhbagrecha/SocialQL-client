import createDataContext from "./createDataContext";
import userReducer from "../reducers/user.reducer";

const fetchLocalUser = (dispatch) => async (payload) => {
  dispatch({ type: "ADD_USER", payload });
};

const loginLocal = (dispatch) => async (payload) => {
  dispatch({ type: "ADD_USER", payload });
};

const signupLocal = (dispatch) => async (payload) => {
  dispatch({ type: "ADD_USER", payload });
};

const logout = (dispatch) => async (payload) => {
  dispatch({ type: "REMOVE_USER", payload });
};

const initialState = {
  userId: null,
  token: null,
};

const { Context, Provider } = createDataContext(
  userReducer,
  { loginLocal, signupLocal, logout, fetchLocalUser },
  initialState
);

export const [UserContext, UserProvider] = [Context, Provider];