import React, { useContext } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MobileStepper from "@material-ui/core/MobileStepper";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { Avatar } from "@material-ui/core";
import { Person, FavoriteBorder, ChatBubbleOutline } from "@material-ui/icons";
import { gql, useMutation } from "@apollo/client";
import { AlertContext } from "../contexts/Alert.context";

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId)
  }
`;

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: "15px 0",
  },
  userMeta: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
  },
  img: {
    maxHeight: 600,
    display: "block",
    overflow: "hidden",
    height: "100%",
    width: "100%",
  },
  captionArea: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
  },
  postActions: {
    paddingBottom: 0,
    backgroundColor: theme.palette.background.default,
    display: "flex",
    "& *": {
      margin: "5px 10px",
    },
  },
}));

function Post(props) {
  const { _id, sources, caption, user } = props;
  const { setAlert } = useContext(AlertContext);
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = sources.length;

  const onError = (err) => {
    console.log({ err });
    return setAlert(true, err.message, "error");
  };

  const onLiked = (data) => {
    return setAlert(true, data.likePost, "success");
  };

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    onCompleted: onLiked,
    onError,
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const handlePostLike = () => {
    likePost({ variables: { postId: _id } });
  };

  return (
    <Paper elevation={4} className={classes.root}>
      <Paper square elevation={0} className={classes.userMeta}>
        <Avatar
          style={{
            width: theme.spacing(3),
            height: theme.spacing(3),
            marginRight: theme.spacing(1),
          }}
        >
          <Person fontSize="small" />
        </Avatar>
        <Typography>{user.name}</Typography>
      </Paper>
      <AutoPlaySwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {sources.map((source, index) => (
          <div key={source.label}>
            {Math.abs(activeStep - index) <= 2 ? (
              <img
                draggable={false}
                className={classes.img}
                src={source.url}
                alt={caption}
              />
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
      {sources.length > 1 ? (
        <MobileStepper
          steps={maxSteps}
          position="static"
          variant="text"
          activeStep={activeStep}
          nextButton={
            <Button
              size="small"
              onClick={handleNext}
              disabled={activeStep === maxSteps - 1}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </Button>
          }
          backButton={
            <Button
              size="small"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
            </Button>
          }
        />
      ) : null}
      <Paper square elevation={0} className={classes.postActions}>
        <FavoriteBorder onClick={handlePostLike} />
        <ChatBubbleOutline />
      </Paper>
      <Paper square elevation={0} className={classes.captionArea}>
        <Typography variant="body2">{caption}</Typography>
      </Paper>
    </Paper>
  );
}

export default Post;
