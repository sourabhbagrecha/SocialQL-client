import React, { useEffect, useState, useContext } from "react";
import {
  gql,
  useLazyQuery,
  useMutation,
  useSubscription,
} from "@apollo/client";
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
import moment from "moment";

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
    sendMessage(body: $body, user: $user, token: $token) {
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

const SUBSCRIBE_TO_CHAT = gql`
  subscription messageAdded($friend: ID!) {
    messageAdded(friend: $friend) {
      _id
      user
      body
      createdAt
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
    const { token } = data.sendMessage;
    setMessages((messages) => messages.filter((msg) => msg._id !== token));
  };
  const onMessageAddedSubscription = ({
    subscriptionData: {
      data: { messageAdded },
    },
  }) => {
    if (messageAdded.user === userId) {
      const messageFoundIndex = messages.findIndex(
        (message) => message._id === messageAdded._id
      );
      if (messageFoundIndex < 0) {
        setMessages((messages) => [...messages, messageAdded]);
      }
    } else {
      setMessages((messages) => [...messages, messageAdded]);
    }
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
  useSubscription(SUBSCRIBE_TO_CHAT, {
    onSubscriptionData: onMessageAddedSubscription,
    variables: {
      friend: user.friendId,
    },
  });

  useEffect(() => {
    setMessages((messages) => []);
    loadChat({ variables: { user: user._id } });
  }, [user]);

  const handleSendMessage = () => {
    const token = uuidv4();
    setMessages((messages) => [
      ...messages,
      { _id: token, body: messageBody, createdAt: new Date(), user: userId },
    ]);
    sendMessage({ variables: { user: user._id, body: messageBody, token } });
  };

  const messageBubble = ({ _id, body, user, createdAt }) => {
    const me = userId === user;
    return (
      <div
        key={_id}
        className={`${classes.bubbleMain} ${
          me ? classes.bubbleMe : classes.bubbleFriend
        }`}
      >
        <div
          className={`${classes.bubbleBody} ${
            me ? classes.bubbleBodyMe : classes.bubbleBodyFriend
          }`}
        >
          <p className={classes.messageBubbleBodyText}>{body}</p>
          <br />
          <p className={classes.messageBubbleTimeText}>
            {moment(createdAt).format("hh:mm a")}
          </p>
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
  messageBubbleBodyText: { padding: 0, margin: 0, float: "left" },
  messageBubbleTimeText: {
    padding: 0,
    margin: 0,
    float: "right",
    fontSize: "0.8rem",
    color: "#515050"
  },
}));

Chat.propTypes = {
  user: propTypes.object,
};

export default Chat;
