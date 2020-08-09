import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import { gql, useMutation } from '@apollo/client';
import { AlertContext } from '../contexts/Alert.context';

const ADD_FRIEND = gql`
  mutation friendRequest($userId: ID!){
    friendRequest(userId: $userId)
  }
`;

function Person(props) {
  const {name, _id} = props;
  const { setAlert } = useContext(AlertContext);

  const onCompleted = (options) => {
    return setAlert(true, "Friend Request sent!", "success");
  };
  const onError = (err) => {
    console.log({err});
    return setAlert(true, err.message, "error");
  };
  const [friendRequest] = useMutation(ADD_FRIEND, {onCompleted, onError})
  const handleAddFriendClick = () => {
    friendRequest({ variables: { userId: _id } })
  }

  return (
    <>
      <h3>{name}</h3>
      <Button variant="contained" onClick={handleAddFriendClick}>Add Friend</Button>
    </>
  )
};

export default Person;
