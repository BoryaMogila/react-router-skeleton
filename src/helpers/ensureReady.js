import routes from '../routes';
import { matchPath } from 'react-router-dom';

export default () => {
  const matchRoutes = routes.map(async (route) => {
    const { Component } = route;
    const match = matchPath(window.location.pathname, route);
    if (match) await Component.load();
    return route;
  });
  return Promise.all(matchRoutes);
}