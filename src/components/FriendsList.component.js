import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@material-ui/core";
import { Person } from "@material-ui/icons";
import propTypes from "prop-types";
import { useQuery, gql } from "@apollo/client";

const GET_FRIENDS = gql`
  query friends {
    friends {
      user {
        _id
        name
        email
      }
      _id
    }
  }
`;

function FriendsList(props) {
  const { selectedFriend, setSelectedFriend } = props;
  const [friends, setFriends] = useState([]);
  const onCompleted = (data) => {
    setFriends((friends) => [...friends, ...data.friends]);
  };
  const onError = (error) => {
    console.log(error);
  };
  const { loading, error } = useQuery(GET_FRIENDS, {
    onCompleted,
    onError,
  });

  const friendItem = (friend) => {
    const {
      user: { _id, name, email },
    } = friend;
    return (
      <ListItem
        button
        key={_id}
        onClick={() => {
          if (selectedFriend.friendId !== friend._id) {
            setSelectedFriend((f) => ({
              _id,
              name,
              email,
              friendId: friend._id,
            }));
          }
        }}
      >
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

  return <List>{friends.map(friendItem)}</List>;
}

FriendsList.propTypes = {
  setSelectedFriend: propTypes.func.isRequired,
};

export default FriendsList;
