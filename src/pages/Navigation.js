import React, { useContext } from "react";
import { Switch, Route } from "react-router-dom";
import Login from "./Login.page";
import Signup from "./Signup.page";
import People from "./People.page";
import Home from "./Home.page";

function Navigation(props) {
  // const {} = useContext(getApo)
  const routes = [
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
      path: "/",
      exact: true,
      component: Home,
      authRequired: true,
    },
    {
      path: "/people",
      exact: true,
      component: People,
      authRequired: true,
    },
  ];

  const routeRender = (route) => <Route key={route.path} {...route} />;

  return <Switch>{routes.map(routeRender)}</Switch>;
}

export default Navigation;
