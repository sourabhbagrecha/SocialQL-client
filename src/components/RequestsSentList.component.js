import React, { useState, useContext } from "react";
import { List } from "@material-ui/core";
import { RemoveCircle } from "@material-ui/icons";
import { useQuery, gql, useMutation } from "@apollo/client";
import { AlertContext } from "../contexts/Alert.context";
import UserListItem from "./UserListItem.component";

const GET_REQUESTS_SENT = gql`
  query requestsSent {
    requestsSent {
      _id
      name
      email
    }
  }
`;

const CANCEL_FRIEND_REQUEST = gql`
  mutation($userId: ID!) {
    cancelFriendRequest(userId: $userId)
  }
`;

function RequestsSentList(props) {
  const [requests, setRequests] = useState([]);
  const { setAlert } = useContext(AlertContext);

  const onCompleted = (data) => {
    setRequests((requests) => [...requests, ...data.requestsSent]);
  };
  const onError = (error) => {
    setAlert(true, error.message, "error");
  };
  const { loading, error } = useQuery(GET_REQUESTS_SENT, {
    onCompleted,
    onError,
  });

  const onCancelFriendRequestCompleted = (data) => {
    return setAlert(true, data.cancelFriendRequest, "success");
  };

  const [cancelFriendRequest] = useMutation(CANCEL_FRIEND_REQUEST, {
    onCompleted: onCancelFriendRequestCompleted,
    onError,
  });

  const handleCancelFriendRequestClick = async (_id) => {
    await cancelFriendRequest({ variables: { userId: _id } });
    setRequests((requests) => {
      return requests.filter((s) => s._id !== _id);
    });
  };

  const itemAction = {
    text: "Cancel",
    icon: RemoveCircle,
    function: handleCancelFriendRequestClick,
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

export default RequestsSentList;
