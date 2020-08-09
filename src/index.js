import React from "react";
import { render } from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import { BrowserRouter } from "react-router-dom";

const Main = () => {
  const [token] = useLocalStorageState("token");

  const client = new ApolloClient({
    uri: "http://localhost:5000/graphql",
    cache: new InMemoryCache(),
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </ApolloProvider>
  );
};

render(<Main />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
