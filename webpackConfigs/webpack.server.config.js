const webpack = require('webpack');// eslint-disable-line import/no-extraneous-dependencies
const path = require('path');
const fs = require('fs');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');// eslint-disable-line import/no-extraneous-dependencies
const config = require('config');
const baseConfig = require('./base.config');

const NODE_ENV = process.env.NODE_ENV || 'development';
const isDevelopment = NODE_ENV === 'development';

// todo автоматизувати підгрузку scoped modules
const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(x => ['.bin'].indexOf(x) === -1)
  .forEach((mod) => { nodeModules[mod] = `commonjs ${mod}`; });

// noinspection JSUnresolvedFunction
const ignorePlugin = new webpack.IgnorePlugin(/\.(css|less)$/);
// noinspection JSUnresolvedFunction
const bannerPlugin = new webpack.BannerPlugin({ banner: 'require("source-map-support").install();', raw: true, entryOnly: false });
const definePlugin = new webpack.DefinePlugin({ RUzVcEydeT7ebsV9: JSON.stringify(config) });
const plugins = [ignorePlugin, bannerPlugin, definePlugin];

if (isDevelopment) {
  plugins.push(new HardSourceWebpackPlugin({
    environmentHash: {
      root: process.cwd(),
      directories: [],
      files: ['../yarn.lock'],
    },
  }));
}

module.exports = {
  ...baseConfig,
  entry: './index.js',
  target: 'node',
  output: { path: path.join(__dirname, '../build'), filename: 'backend.js' },
  mode: NODE_ENV,
  module: {
    rules: [
      {
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            plugins: [
              '@babel/plugin-transform-runtime',
              ['babel-plugin-styled-components', { ssr: true, displayName: isDevelopment }],
              "@babel/plugin-syntax-dynamic-import",
              "@babel/plugin-syntax-import-meta",
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-proposal-json-strings",
              [
                '@babel/plugin-proposal-decorators',
                { 'legacy': true }
              ],
              "@babel/plugin-proposal-function-sent",
              "@babel/plugin-proposal-export-namespace-from",
              "@babel/plugin-proposal-numeric-separator",
              "@babel/plugin-proposal-throw-expressions"
            ],
            presets: [
              ['@babel/preset-env', {
                targets: { node: '10.2.1' },
                modules: 'commonjs',
              }],
              '@babel/preset-react',
            ],
          },
        },
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.json/, loader: 'json-loader', type: 'javascript/auto' },
    ],
  },
  externals: nodeModules,
  plugins,
  devtool: 'sourcemap',
};
