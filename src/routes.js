import routerConfig from './routerConfig';
import generateAsyncRouteComponent from './helpers/generateAsyncRouteComponent';
import Placeholder from './components/common/PlaceholderComponent';

const reactRouters = routerConfig.map(({ path, componentPath }) => ({
  path,
  Component: generateAsyncRouteComponent({ loader: () => import(`.${componentPath}`), Placeholder }),
}));

export default reactRouters;