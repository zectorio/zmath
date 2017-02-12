
var path = require('path');

module.exports = {
  entry : "./test/index",
  output : {
    path : path.resolve(__dirname, "build"),
    filename : "zmath-test.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  }
};
