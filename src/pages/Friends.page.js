import React from "react";
import { gql, useQuery } from "@apollo/client";
import Friend from "../components/Friend.component";

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

function Friends() {

  const onError = (error) => {
    console.log(error);
  };
  const { loading, error, data } = useQuery(GET_FRIENDS, {
    onError,
  });

  const renderFriend = (prop) => <Friend {...prop} />;

  if (loading) return `Loading...`;
  if (error) return `${error}`;
  return data.friends.map(renderFriend);
}

export default Friends;
