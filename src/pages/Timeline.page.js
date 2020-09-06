import React, { useState, useContext, useEffect } from "react";
import { Container } from "@material-ui/core";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { AlertContext } from "../contexts/Alert.context";
import Post from "../components/Post.component";

const GET_POSTS_QUERY = gql`
  query feed {
    feed {
      _id
      caption
      sources{
        url
        type
      }
      user {
        _id
        name
        email
      }
    }
  }
`;

function Timeline(props) {
  const [posts, setPosts] = useState([]);
  const { setAlert } = useContext(AlertContext);
  const onError = (err) => {
    console.log({ err });
    return setAlert(true, err.message, "error");
  };
  const onCompleted = ({feed}) => {
    setPosts(posts => [...posts, ...feed ])
  };
  useQuery(GET_POSTS_QUERY, {
    onError,
    onCompleted,
  });
  return <Container maxWidth="sm" style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: 0}}>
    {
      posts.map(post => <Post {...post} />)
    }
  </Container>;
}

export default Timeline;
