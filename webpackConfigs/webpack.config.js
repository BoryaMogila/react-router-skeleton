const webpack = require('webpack');
const config = require('config');
const NODE_ENV = process.env.NODE_ENV || 'development';
const isDevelopment = NODE_ENV === 'development';
const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path');
const glob = require('glob-all');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssPlugin = require('purgecss-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const baseConfig = require('./base.config');

// const whitelistPatterns = [
//   'ReactModal', 'icon-', '-news', 'c-progress', 'offline-', '-metro-line', 'm-st-', 'kyiv',
//   'kharkiv', 'green', 'blue', 'red', 'hot', 'stock', 'project', 'order', 'lg-', 'fade-',
// ];
// const collectWhitelistPatterns = () => [new RegExp(whitelistPatterns.join('|'))];

//робить доступними Environment variables на клієнті так само як на ноді
//noinspection JSUnresolvedFunction
const environmentPlugin = new webpack.EnvironmentPlugin(Object.keys(process.env));

//експортить константи
//noinspection JSUnresolvedFunction
const definePlugin = new webpack.DefinePlugin({ RUzVcEydeT7ebsV9: JSON.stringify(config) });

const PATHS = { src: path.join(__dirname, '../src') };
// Для того, щоб не тягнути в бандл всі локалі з момента, а лише ті, що потрібні.
//noinspection JSUnresolvedFunction
const contextReplacementPlugin =
  new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(uk|ru)$/);
const plugins = [
  new MiniCssExtractPlugin({
    filename: "css/[name].[chunkhash].css",
    chunkFilename: "css/chunks/[name].[chunkhash].css"
  }),
  new PurgecssPlugin({
    paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    //whitelistPatterns: collectWhitelistPatterns,
  }),
  environmentPlugin,
  definePlugin,
  contextReplacementPlugin,
  new AssetsPlugin({filename: './public/build/assets/bundleAssets.json'}),
];

if (isDevelopment) {
  plugins.push(new HardSourceWebpackPlugin({
    environmentHash: { root: process.cwd(), directories: [], files: ['../yarn.lock'] },
  }));
}
if (NODE_ENV === 'production') {
  const makefileNamePattern = extension => `[path].${extension}[query]`;
  const params = {
    test: /\.js|\.html|\.css/,
    threshold: 10240,
    minRatio: 0.8,
  };
  plugins.push(new CompressionPlugin({
      ...params,
      filename: makefileNamePattern('gz'),
      algorithm: 'gzip',
    }),
  );
}
if (process.env.UNALIZE_SIZE) {
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
  plugins.push(new BundleAnalyzerPlugin());
}

module.exports = {
  ...baseConfig,
  //точки входу. З них починається аналіз коду
  entry: {
    bundle: './src/index.js'
  },
  mode: NODE_ENV,
  output: {
    //путь куди ложити збілджені файли
    path: path.join(__dirname, '../public/build'),
    //путь звідки завантажувати чанки
    publicPath: `${config.js_domain}/react/public/build/`,
    //назва основного файла білда
    filename: `js/[name].[chunkhash].js`,
    chunkFilename: 'js/chunks/[name].[chunkhash].js'
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: false,
      cacheGroups: {
        styles: {
          name: 'bundle',
          test: /\.css$/,
          chunks: 'initial',
          enforce: true,
        },
        vendor: {
          test: /\/react\/|redux|router|babelfish|superagent|es6-promise/,
          chunks: 'initial',
          name: 'vendor',
          enforce: true,
          priority: -10,
        },
        default: { minChunks: 2, priority: -20, reuseExistingChunk: true }
      }
    },
    minimizer: [
      new UglifyJSPlugin({
        parallel: true,
        uglifyOptions: {
          beautify: false,
          compress: {
            sequences: true,
            booleans: true,
            loops: true,
            unused: true,
            warnings: false,
            //drop_console: true,
            unsafe: true
          },
          comments: false,
        }
      })
    ]
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            plugins: [
              "@babel/plugin-transform-runtime",
              ['babel-plugin-styled-components', { 'ssr': true }],
              'array-includes',
              "@babel/plugin-syntax-dynamic-import",
              "@babel/plugin-syntax-import-meta",
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-proposal-json-strings",
              [
                "@babel/plugin-proposal-decorators",
                {
                  "legacy": true
                }
              ],
              "@babel/plugin-proposal-function-sent",
              "@babel/plugin-proposal-export-namespace-from",
              "@babel/plugin-proposal-numeric-separator",
              "@babel/plugin-proposal-throw-expressions"
            ],
            presets: [
              ["@babel/preset-env", {
                targets: { browsers: ["ie >= 9"] },
                modules: false,
              }],
              "@babel/react"
            ],
          }
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader?minimize=true'],
      },
      {
        test: /\.svg($|\?.+)/,
        loader: 'svg-url-loader?limit=10&noquotes=true&name=img/[name].[ext]',
      },
      {
        test: /\.(png|jpg|gif)($|\?.+)/,
        loader: 'url-loader?limit=10&name=img/[name].[ext]',
      },
      { test: /\.svg($|\?.+)/, loader: 'url-loader?limit=10&mimetype=image/svg+xml&name=img/[name].[ext]' },
      { test: /\.woff($|\?.+)/, loader: 'url-loader?limit=10&mimetype=application/font-woff&name=img/[name].[ext]' },
      { test: /\.woff2($|\?.+)/, loader: 'url-loader?limit=10&mimetype=application/font-woff2&name=img/[name].[ext]' },
      { test: /\.[ot]tf($|\?.+)/, loader: 'url-loader?limit=10&mimetype=application/octet-stream&name=img/[name].[ext]' },
      { test: /\.eot($|\?.+)/, loader: 'url-loader?limit=10&mimetype=application/vnd.ms-fontobject&name=img/[name].[ext]' },
      { test: /\.json/, loader: 'json-loader', type: 'javascript/auto' }
    ]
  },
  //правила пошуку фалів при require або import
  resolve: {
      alias: {
          dom_design: path.resolve(__dirname, `../${config.designPath}/dom_design`),
      },
    // require('some_file_name') => require('some_file_name.(js|jsx)')
    extensions: ['.js', '.jsx']
  },
  //http://webpack.github.io/docs/configuration.html#devtool
  devtool: NODE_ENV === 'production' ? false : 'eval-source-map',
  plugins,
  externals: { config: require('config') }
};
