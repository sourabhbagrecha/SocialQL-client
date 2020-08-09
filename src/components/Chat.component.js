import React, { useEffect, useState, useContext } from "react";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import {
  Typography,
  Paper,
  makeStyles,
  Box,
  TextField,
} from "@material-ui/core";
import propTypes from "prop-types";
import { v4 as uuidv4 } from "uuid";
import { UserContext } from "../contexts/User.context";
import useInputState from "../hooks/useInputState";
import { AlertContext } from "../contexts/Alert.context";

const CHAT_QUERY = gql`
  query findChat($user: ID!) {
    chat(user: $user) {
      body
      createdAt
      user
    }
  }
`;

const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($body: String!, $user: ID!, $token: ID!) {
    sendMessage(body: $body, user: $user, token: $token){
      token
      message {
        _id
        user
        body
        createdAt
      }
    }
  }
`;

function Chat(props) {
  const { user } = props;
  const classes = useStyles();
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody, clearMessageBody] = useInputState("");
  const {
    state: { userId },
  } = useContext(UserContext);
  const { setAlert } = useContext(AlertContext);

  const onChatLoaded = (data) => {
    setMessages((messages) => [...messages, ...data.chat]);
  };
  const onMessageSent = (data) => {
    const { message, token } = data.sendMessage;
    setMessages(messages => messages.map(msg => {
      if(msg._id === token){
        return message;
      } else {
        return msg;
      }
    }))
  };
  const onError = (err) => {
    console.log({ err });
    return setAlert(true, err.message, "error");
  };

  const [loadChat, { loading, error }] = useLazyQuery(CHAT_QUERY, {
    onCompleted: onChatLoaded,
    onError,
  });
  const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION, {
    onCompleted: onMessageSent,
    onError,
  });

  useEffect(() => {
    setMessages((messages) => []);
    loadChat({ variables: { user: user._id } });
  }, [user]);

  const handleSendMessage = () => {
    const token = uuidv4();
    setMessages((messages) => [...messages, { _id: token, body: messageBody, createdAt: (new Date()), user: userId }]);
    sendMessage({ variables: { user: user._id, body:  messageBody, token } })
  };

  const messageBubble = ({ _id, body, user, createdAt }) => {
    const me = userId === user;
    return (
      <div
        className={`${classes.bubbleMain} ${
          me ? classes.bubbleMe : classes.bubbleFriend
        }`}
      >
        <div
          className={`${classes.bubbleBody} ${
            me ? classes.bubbleBodyMe : classes.bubbleBodyFriend
          }`}
        >
          <Typography variant="body2">{body}</Typography>
        </div>
      </div>
    );
  };

  const handleSend = (e) => {
    if (e.keyCode === 13) {
      clearMessageBody();
      return handleSendMessage();
    }
  };

  if (loading) return `Loading...`;
  if (error) return `Error: ${error}`;

  return (
    <Paper className={classes.chatMain} elevation={4}>
      <Typography className={classes.userName} variant="h4">
        {user.name}
      </Typography>
      <Box className={classes.chatBody}>{messages.map(messageBubble)}</Box>
      <TextField
        fullWidth
        variant="outlined"
        value={messageBody}
        onChange={setMessageBody}
        onKeyDown={handleSend}
        className={classes.replyField}
        placeholder="Type a message. Press enter to submit!"
      />
    </Paper>
  );
}

const useStyles = makeStyles((theme) => ({
  chatMain: {
    backgroundColor: theme.palette.grey["50"],
    margin: "0 2%",
    padding: "1% 2%",
  },
  chatBody: {
    height: "80vh",
    overflowY: "scroll",
    overflowX: "hidden",
  },
  bubbleBody: {
    padding: "4px 10px",
    borderRadius: "10px",
    display: "inline-block",
  },
  bubbleMain: {
    display: "flex",
    margin: "1%",
  },
  bubbleMe: {
    flexDirection: "row-reverse",
  },
  bubbleFriend: {
    flexDirection: "row",
  },
  bubbleBodyMe: {
    backgroundColor: "lightblue",
  },
  bubbleBodyFriend: {
    backgroundColor: "lightgreen",
  },
  replyField: {
    marginTop: "2%",
  },
}));

Chat.propTypes = {
  user: propTypes.object,
};

export default Chat;
