import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@material-ui/core";
import { Person } from "@material-ui/icons";
import { useQuery, gql } from "@apollo/client";

const GET_REQUESTS_RECEIVED = gql`
  query requestsReceived {
    requestsReceived {
      _id
      name
      email
    }
  }
`;

function RequestsReceivedList(props) {
  const [requests, setRequests] = useState([]);
  const onCompleted = (data) => {
    setRequests((requests) => [
      ...requests,
      ...data.requestsReceived,
    ]);
  };
  const onError = (error) => {
    console.log(error);
  };
  const { loading, error } = useQuery(GET_REQUESTS_RECEIVED, {
    onCompleted,
    onError,
  });

  const requestReceivedItem = (user) => {
    const { _id, name, email } = user;
    return (
      <ListItem button key={_id} onClick={() => {}}>
        <ListItemAvatar>
          <Avatar>
            <Person />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={name} secondary={email} />
      </ListItem>
    );
  };

  if (loading) return "loading...";
  if (error) return `${error}`;

  return <List>{requests.map(requestReceivedItem)}</List>;
}

export default RequestsReceivedList;
