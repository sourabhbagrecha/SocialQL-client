import React, { useState, useContext } from "react";
import { List } from "@material-ui/core";
import { useQuery, gql, useMutation } from "@apollo/client";
import UserListItem from "./UserListItem.component";
import { AlertContext } from "../contexts/Alert.context";
import { PersonAdd } from "@material-ui/icons";

const GET_SUGGESTIONS = gql`
  query friendSuggestions {
    friendSuggestions {
      _id
      name
      email
    }
  }
`;

const SEND_FRIEND_REQUEST = gql`
  mutation friendRequest($userId: ID!) {
    friendRequest(userId: $userId)
  }
`;

function SuggestionsList(props) {
  const [suggestions, setSuggestions] = useState([]);
  const { setAlert } = useContext(AlertContext);

  const onCompleted = (data) => {
    setSuggestions((suggestions) => [
      ...suggestions,
      ...data.friendSuggestions,
    ]);
  };
  const onError = (error) => {
    console.log(error);
  };
  const { loading, error } = useQuery(GET_SUGGESTIONS, {
    onCompleted,
    onError,
  });

  const onFriendRequestCompleted = (data) => {
    return setAlert(true, data.friendRequest, "success");
  };

  const [sendFriendRequest] = useMutation(SEND_FRIEND_REQUEST, {
    onCompleted: onFriendRequestCompleted,
    onError,
  });

  const handleSendFriendRequestClick = async (_id) => {
    await sendFriendRequest({ variables: { userId: _id } });
    setSuggestions((suggestions) => {
      return suggestions.filter((s) => s._id !== _id);
    });
  };

  const itemAction = {
    text: "Add Friend",
    icon: PersonAdd,
    function: handleSendFriendRequestClick,
  };

  if (loading) return "loading...";
  if (error) return `${error}`;

  return (
    <List>
      {suggestions.map((s) => (
        <UserListItem {...s} action={itemAction} />
      ))}
    </List>
  );
}

export default SuggestionsList;
