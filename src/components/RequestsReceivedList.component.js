import React, { useState, useContext } from "react";
import { List } from "@material-ui/core";
import { PersonAdd } from "@material-ui/icons";
import { useQuery, gql, useMutation } from "@apollo/client";
import UserListItem from "./UserListItem.component";
import { AlertContext } from "../contexts/Alert.context";

const GET_REQUESTS_RECEIVED = gql`
  query requestsReceived {
    requestsReceived {
      _id
      name
      email
    }
  }
`;

const ACCEPT_FRIEND_REQUEST = gql`
  mutation friendAccept($userId: ID!) {
    friendAccept(userId: $userId)
  }
`;

function RequestsReceivedList(props) {
  const { setAlert } = useContext(AlertContext);
  const [requests, setRequests] = useState([]);
  const onCompleted = (data) => {
    setRequests((requests) => [...requests, ...data.requestsReceived]);
  };
  const onError = (error) => {
    console.log(error);
  };
  const { loading, error } = useQuery(GET_REQUESTS_RECEIVED, {
    onCompleted,
    onError,
  });

  const onAcceptFriendRequestCompleted = (data) => {
    return setAlert(true, data.friendAccept, "success");
  };

  const [acceptFriendRequest] = useMutation(ACCEPT_FRIEND_REQUEST, {
    onCompleted: onAcceptFriendRequestCompleted,
    onError,
  });

  const handleAcceptFriendRequestClick = async (_id) => {
    await acceptFriendRequest({ variables: { userId: _id } });
    setRequests((requests) => {
      return requests.filter((req) => req._id !== _id);
    });
  };

  const itemAction = {
    text: "Accept",
    icon: PersonAdd,
    function: handleAcceptFriendRequestClick,
  };

  if (loading) return "loading...";
  if (error) return `${error}`;

  return (
    <List>
      {requests.map((req) => (
        <UserListItem {...req} action={itemAction} />
      ))}
    </List>
  );
}

export default RequestsReceivedList;
