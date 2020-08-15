import React, { useState } from "react";
import { AppBar, Tabs, Tab, Typography, Box, Grid } from "@material-ui/core";
import FriendsList from "../components/FriendsList.component";
import Chat from "../components/Chat.component";

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

const Home = () => {
  const [value, setValue] = React.useState(0);
  const [selectedFriend, setSelectedFriend] = useState({});

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid container>
      <Grid item md={4}>
        <AppBar position="static">
          <Tabs
            variant="standard"
            value={value}
            onChange={handleChange}
            aria-label="nav tabs example"
          >
            <Tab label="Friends" />
            <Tab label="Suggestions" />
            <Tab label="Requests" />
          </Tabs>
        </AppBar>
        <TabPanel value={value} index={0}>
          <FriendsList
            setSelectedFriend={setSelectedFriend}
            selectedFriend={selectedFriend}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          Suggestions
        </TabPanel>
        <TabPanel value={value} index={2}>
          Requests
        </TabPanel>
      </Grid>
      <Grid item md={8}>
        {selectedFriend._id && <Chat user={selectedFriend} />}
      </Grid>
    </Grid>
  );
};

export default Home;
