import PropTypes from 'prop-types';
import React from 'react';
import { renderToString } from 'react-dom/server';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';
// noinspection JSUnresolvedVariable
import config, { js_domain as jsDomain } from 'config';
// eslint-disable-next-line import/named
import assets from '../../public/build/assets/bundleAssets.json';

const { bundle: { js: mainJs, css: mainCSS } = {}, vendor: { js: vendorJS } = {} } = assets;
/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
const HtmlComponent = (props) => {
  const { component, store } = props;
  //const state = store.getState();
  // noinspection JSUnresolvedFunction
  const content = component ? renderToString(component) : '';
  const head = Helmet.rewind();
  const initCss = (
    <link
      href={`${mainCSS}`}
      type="text/css"
      rel="stylesheet"
    />
  );
  const contentComponent = <div id="content" dangerouslySetInnerHTML={{ __html: content }} />;
  // eslint-disable-next-line react/no-danger
  //const stateComponent = <script dangerouslySetInnerHTML={{ __html:
  // `window.init=${serialize(state)};` }} />;
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="referrer" content="unsafe-url" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {head.base.toComponent()}
        {head.title.toComponent()}
        {head.meta.toComponent()}
        {head.link.toComponent()}
        {head.script.toComponent()}
        {initCss}
      </head>
      <body>
        {contentComponent}
        {/*{stateComponent}*/}
        <script src={`${mainJs}`} async="async" />
        <script src={`${vendorJS}`} async="async" />
      </body>
    </html>
  );
};

HtmlComponent.propTypes = {
  component: PropTypes.node.isRequired,
  store: PropTypes.shape({}).isRequired,
};

export default HtmlComponent;
