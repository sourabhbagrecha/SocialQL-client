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

const GET_SUGGESTIONS = gql`
  query friendSuggestions {
    friendSuggestions {
      _id
      name
      email
    }
  }
`;

function SuggestionsList(props) {
  const [suggestions, setSuggestions] = useState([]);
  const onCompleted = (data) => {
    setSuggestions((suggestions) => [...suggestions, ...data.friendSuggestions]);
  };
  const onError = (error) => {
    console.log(error);
  };
  const { loading, error } = useQuery(GET_SUGGESTIONS, {
    onCompleted,
    onError,
  });

  const suggestionItem = (user) => {
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

  return <List>{suggestions.map(suggestionItem)}</List>;
}

export default SuggestionsList;
