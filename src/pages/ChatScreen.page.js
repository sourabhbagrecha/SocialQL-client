import React, { useState } from "react";
import { AppBar, Tabs, Tab, Typography, Box, Grid } from "@material-ui/core";
import FriendsList from "../components/FriendsList.component";
import Chat from "../components/Chat.component";
import SuggestionsList from "../components/SuggestionsList.component";
import RequestsReceivedList from "../components/RequestsReceivedList.component";
import RequestsSentList from "../components/RequestsSentList.component";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </Typography>
  );
}

const ChatScreen = () => {
  const [value, setValue] = React.useState(0);
  const [selectedFriend, setSelectedFriend] = useState({});

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid container style={{ margin: 0 }}>
      <Grid item md={4} style={{ margin: 0 }}>
        <AppBar position="static" style={{ margin: 0 }}>
          <Tabs
            variant="fullWidth"
            value={value}
            onChange={handleChange}
            aria-label="nav tabs example"
          >
            <Tab wrapped label="Friends" />
            <Tab wrapped label="Suggestions" />
            <Tab wrapped label="Requests Received" />
            <Tab wrapped label="Requests Sent" />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <FriendsList
            setSelectedFriend={setSelectedFriend}
            selectedFriend={selectedFriend}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <SuggestionsList />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <RequestsReceivedList />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <RequestsSentList />
        </TabPanel>
      </Grid>
      <Grid item md={8}>
        {selectedFriend._id && <Chat user={selectedFriend} />}
      </Grid>
    </Grid>
  );
};

export default ChatScreen;
