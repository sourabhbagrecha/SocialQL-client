import React from "react";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  Fab,
  makeStyles,
} from "@material-ui/core";
import { Person } from "@material-ui/icons";

function UserListItem(props) {
  const { _id, name, email, action } = props;
  const classes = useStyles();

  const handleClick = () => action.function(_id);
  return (
    <ListItem key={_id} className={classes.main}>
      <ListItemAvatar>
        <Avatar>
          <Person />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={name} secondary={email} />
      <div className="hidden-button">
        <ListItemSecondaryAction>
          <Fab
            size="small"
            color="secondary"
            aria-label="edit"
            variant="extended"
            onClick={handleClick}
          >
            <action.icon /> &nbsp; {action.text}
          </Fab>
        </ListItemSecondaryAction>
      </div>
    </ListItem>
  );
}

const useStyles = makeStyles({
  main: {
    "& .hidden-button": {
      display: "none",
    },
    "&:hover .hidden-button": {
      display: "flex",
    },
  },
});

export default UserListItem;
