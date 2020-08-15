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

const GET_REQUESTS_SENT = gql`
  query requestsSent {
    requestsSent {
      _id
      name
      email
    }
  }
`;

function RequestsSentList(props) {
  const [requests, setRequests] = useState([]);
  const onCompleted = (data) => {
    setRequests((requests) => [
      ...requests,
      ...data.requestsSent,
    ]);
  };
  const onError = (error) => {
    console.log(error);
  };
  const { loading, error } = useQuery(GET_REQUESTS_SENT, {
    onCompleted,
    onError,
  });

  const requestSentItem = (user) => {
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

  return <List>{requests.map(requestSentItem)}</List>;
}

export default RequestsSentList;
