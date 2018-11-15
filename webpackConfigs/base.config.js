module.exports = {
  // не буде працювати без флага --watch
  watchOptions: {
    // запускати перезбірку через 100 мс після збереження файла. Default 300
    aggregateTimeout: 100,
    poll: 1000,
    ignored: [/node_modules|build/],
  },
};

// "react": "15.6.2",
//   "react-cookie": "0.4.8",
//   "react-dom": "15.6.2",
//   "react-helmet": "3.1.0",
//   "react-redux": "5.0.7",
//   "react-router": "2.8.1",
//   "react-router-redux": "4.0.8",
//   "redux": "4.0.1",
//   "redux-multi": "0.1.91",
//   "redux-promise-middleware": "5.1.1",
//   "redux-thunk": "2.1.0",
//   "reselect": "2.5.4",
