import React, { useState } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import Login from "./Login.page";
import Signup from "./Signup.page";
import People from "./People.page";
import ChatScreen from "./ChatScreen.page";
import Timeline from "./Timeline.page";
import PostForm from "../components/PostForm.component";
import { Home, Chat, Person, Public, AddCircle } from "@material-ui/icons";
import {
  BottomNavigationAction,
  BottomNavigation,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  bottomNavigation: {
    width: "100%",
    margin: 0,
    position: "fixed",
    zIndex: 2,
    left: 0,
    bottom: 0,
  },
  bottomNavigationAction: {
    minWidth: "unset",
  },
  main: { 
    paddingBottom: theme.spacing(5),
  },
}));

function Navigation(props) {
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState("home");
  const routes = [
    {
      path: "/",
      tab: "home",
      exact: true,
      component: Timeline,
    },
    {
      path: "/login",
      exact: true,
      component: Login,
    },
    {
      path: "/signup",
      exact: true,
      component: Signup,
    },
    {
      path: "/chat",
      exact: true,
      tab: "chat",
      component: ChatScreen,
      authRequired: true,
    },
    {
      path: "/people",
      exact: true,
      tab: "explore",
      component: People,
      authRequired: true,
    },
    {
      path: "/post/new",
      exact: true,
      tab: "new",
      component: PostForm,
      authRequired: true,
    },
  ];

  const routeRender = (route) => <Route key={route.path} {...route} />;
  const history = useHistory();
  return (
    <>
      <main className={classes.main}>
        <Switch>{routes.map(routeRender)}</Switch>
      </main>
      <BottomNavigation
        value={selectedTab}
        onChange={(event, newTab) => {
          const path = routes.find((route) => route.tab === newTab).path;
          history.push(path);
          setSelectedTab(newTab);
        }}
        className={classes.bottomNavigation}
      >
        <BottomNavigationAction
          classes={{ root: classes.bottomNavigationAction }}
          label="Home"
          value="home"
          icon={<Home />}
        />
        <BottomNavigationAction
          classes={{ root: classes.bottomNavigationAction }}
          label="Chat"
          value="chat"
          icon={<Chat />}
        />
        <BottomNavigationAction
          classes={{ root: classes.bottomNavigationAction }}
          label="Post"
          value="new"
          icon={<AddCircle />}
        />
        <BottomNavigationAction
          classes={{ root: classes.bottomNavigationAction }}
          label="Explore"
          value="explore"
          icon={<Public />}
        />
        <BottomNavigationAction
          classes={{ root: classes.bottomNavigationAction }}
          label="Account"
          value="account"
          icon={<Person />}
        />
      </BottomNavigation>
    </>
  );
}

export default Navigation;
