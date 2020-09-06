import React, { useContext, useState } from "react";
import {
  Container,
  Typography,
  makeStyles,
  TextField,
  Button,
  CircularProgress,
} from "@material-ui/core";
import useInputState from "../hooks/useInputState";
import { useMutation, gql } from "@apollo/client";
import { AlertContext } from "../contexts/Alert.context";
import { UPLOAD_STATUS, SOURCE_TYPE } from "../constants";
import { v4 as uuid } from "uuid";
import { useHistory } from "react-router-dom";

const UPLOAD_FILE_MUTATION = gql`
  mutation($file: Upload!, $key: String!) {
    singleUploadStream(file: $file, key: $key) {
      key
      url
    }
  }
`;

const CREATE_POST_MUTATION = gql`
  mutation($caption: String!, $sources: [SourcePayload]) {
    createPost(input: { caption: $caption, sources: $sources }) {
      caption
      sources {
        _id
        type
        url
      }
      _id
    }
  }
`;

function PostForm(props) {
  const classes = useStyles();
  const history = useHistory();
  const { setAlert } = useContext(AlertContext);
  const [caption, setCaption] = useInputState("");
  const [sources, setSources] = useState([]);
  const onError = (err) => {
    return setAlert(true, err.message, "error");
  };
  const onFileUpload = ({ singleUploadStream }) => {
    const { key, url } = singleUploadStream;
    setSources((sources) =>
      sources.map((source) => {
        if (source.key === key) {
          return {
            ...source,
            status: UPLOAD_STATUS.UPLOADED,
            url,
          };
        } else {
          return source;
        }
      })
    );
    return setAlert(true, "File uploaded successfully", "success");
  };
  const onPostCreated = (data) => {
    history.push("/");
    setAlert(true, "Post uploaded successfully!", "success");
  };
  const [fileUploadMutation] = useMutation(UPLOAD_FILE_MUTATION, {
    onError,
    onCompleted: onFileUpload,
  });
  const [createPostMutation] = useMutation(CREATE_POST_MUTATION, {
    onError,
    onCompleted: onPostCreated,
  });
  const submitPost = () => {
    if (sources.length === 0) {
      return setAlert(true, "You must add at least 1 file.", "warning");
    }
    if (
      sources.filter((source) => source.status !== UPLOAD_STATUS.UPLOADED)
        .length !== 0
    ) {
      return setAlert(
        true,
        "Please let all your files uploaded before submitting.",
        "warning"
      );
    }
    createPostMutation({
      variables: {
        caption,
        sources: sources.map((s) => ({
          type: SOURCE_TYPE.IMAGE,
          url: s.url,
        })),
      },
    });
  };

  const onUploadInputChange = (e) => {
    const [file] = e.target.files;
    if (sources.length > 3) {
      return setAlert(true, "You can upload 4 items at once.", "warning");
    }
    if (file.size > 5000000) {
      return setAlert(
        true,
        "File Size should not exceed the 5MB limit",
        "error"
      );
    }
    const key = uuid();
    const tempUrl = URL.createObjectURL(file);
    setSources((sources) => [
      ...sources,
      { tempUrl, file, key, url: null, status: UPLOAD_STATUS.UPLOADING },
    ]);
    fileUploadMutation({
      variables: { file, key },
    });
  };

  const FilePreview = ({ status, url, tempUrl }) => {
    const uploaded = status === UPLOAD_STATUS.UPLOADED;
    const previewGrayscale = `grayscale(${uploaded ? "0" : "100"}%)`;
    return (
      <div draggable className={classes.filePreviewContainer}>
        <img
          src={uploaded ? url : tempUrl}
          alt="hvkjfbvkjn"
          style={{
            WebkitFilter: previewGrayscale,
            filter: previewGrayscale,
            objectFit: "cover",
            width: "200px",
            height: "200px",
          }}
        />
        {uploaded ? null : (
          <div className={classes.uploadStatusProgress}>
            <CircularProgress />
          </div>
        )}
      </div>
    );
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h2">New Post</Typography>
      <div className={classes.formGroup}>
        <TextField
          value={caption}
          onChange={setCaption}
          placeholder="What's this post about?"
          label="Caption"
          variant="outlined"
          fullWidth
          rows={2}
          rowsMax={7}
          multiline
        />
      </div>
      <div className={classes.formGroup}>
        <input
          accept="image/*"
          className={classes.fileInput}
          id="contained-button-file"
          multiple={false}
          type="file"
          onChange={onUploadInputChange}
        />
      </div>
      <label htmlFor="contained-button-file">
        <Button
          className={classes.inputMain}
          variant="contained"
          color="secondary"
          component="span"
          disabled={sources.length > 3}
        >
          {sources.length === 0 ? "Upload" : "Add More"}
        </Button>
      </label>
      <div style={{ overflowX: "scroll", display: "flex" }}>
        {sources.map((source) => (
          <FilePreview {...source} />
        ))}
      </div>
      <div className={classes.formButton}>
        <Button
          onClick={submitPost}
          variant="outlined"
          fullWidth
          color="primary"
        >
          Post
        </Button>
      </div>
    </Container>
  );
}

const useStyles = makeStyles({
  formGroup: {
    margin: "10px 0",
  },
  fileInput: {
    display: "none",
  },
  inputMain: {
    margin: "0.5rem 0",
  },
  uploadStatusProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  filePreviewContainer: {
    position: "relative",
    margin: "15px 25px",
    border: "4px solid grey",
    width: "200px",
    height: "200px",
    WebkitBoxShadow: "7px 7px 5px 0px rgba(98, 50, 50, 0.4)",
    MozBoxShadow: "7px 7px 5px 0px rgba(98, 50, 50, 0.4)",
    boxShadow: "7px 7px 5px 0px rgba(98, 50, 50, 0.4)",
  },
});

export default PostForm;
