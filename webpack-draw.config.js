
var path = require('path');

module.exports = {
  entry : "./test/draw",
  devtool : "inline-source-map",
  output : {
    path : path.resolve(__dirname, "build"),
    filename : "zmath-draw.js"
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
