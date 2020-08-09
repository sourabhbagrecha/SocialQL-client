import React from "react";
import { gql, useQuery } from "@apollo/client";
import Friend from "../components/Friend.component";

const GET_FRIENDS = gql`
  query getFriends {
    friends {
      _id
      name
      email
    }
  }
`;

function Friends() {
  const { loading, error, data } = useQuery(GET_FRIENDS);

  const renderFriend = (prop) => <Friend {...prop} />;

  if (loading) return `Loading...`;
  if (error) return `${error}`;
  return data.friends.map(renderFriend);
}

export default Friends;
