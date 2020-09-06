import React, { useState } from "react";
import { render } from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  split,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { BrowserRouter } from "react-router-dom";
import { getMainDefinition } from "@apollo/client/utilities";
import { createUploadLink } from "apollo-upload-client";

const tunnelURL = "localhost:5000";

const Main = () => {
  const [globalToken, setGlobalToken] = useState("");

  const httpLink = new createUploadLink({
    uri: `http://${tunnelURL}/graphql`,
    headers: {
      Authorization: `Bearer ${globalToken}`,
    },
  });

  const wsLink = new WebSocketLink({
    uri: `ws://${tunnelURL}/graphql`,
    options: {
      reconnect: true,
      connectionParams: {
        Authorization: `Bearer ${globalToken}`
      },
    },
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink
  );

  const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
    headers: {
      Authorization: `Bearer ${globalToken}`,
    },
  });
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App setGlobalToken={setGlobalToken} />
      </BrowserRouter>
    </ApolloProvider>
  );
};

render(<Main />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
