import React from 'react';
import {render} from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import generateAsyncRouteComponent from './helpers/generateAsyncRouteComponent';
import Placeholder from './components/common/PlaceholderComponent';
import ensureReady from './helpers/ensureReady';

ensureReady().then((routes) => {
  render(
    <Router>
      <Switch>
        {routes.map(({ path, Component }) => (<Route path={path} component={Component} key={path}/>))}
      </Switch>
    </Router>
    , document.getElementById('content')
  );
});

