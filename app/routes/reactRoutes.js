import routerConfig from '../../src/routerConfig';

const reactRouters = routerConfig.map(({ path, componentPath }) => ({
  path,
  Component: require(`../../src${componentPath}`).default,
}));

export default reactRouters;