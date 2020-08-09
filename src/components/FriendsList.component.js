import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@material-ui/core";
import { Person } from "@material-ui/icons";
import propTypes from 'prop-types';

function FriendsList(props) {
  const {setSelectedFriend} = props;
  const friends = [
    {
      "_id": "5f2573d822d0e1699cff52c1",
      "name": "Anshul Bhardwaj",
      "email": "anshul@gmail.com"
    },
    {
      "_id": "5f2573d822d0e1699cff52c1",
      "name": "Anshul Bhardwaj",
      "email": "anshul@gmail.com"
    },
    {
      "_id": "5f2573d822d0e1699cff52c1",
      "name": "Anshul Bhardwaj",
      "email": "anshul@gmail.com"
    }
  ]

  const friendItem = ({ _id, name, email }) => (
    <ListItem button onClick={() => setSelectedFriend({ _id, name, email })}>
      <ListItemAvatar>
        <Avatar>
          <Person />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={name} secondary={email} />
    </ListItem>
  );

  return <List>
    {friends.map(friendItem)}
  </List>;
}

FriendsList.propTypes = {
  setSelectedFriend: propTypes.func.isRequired
}

export default FriendsList;
