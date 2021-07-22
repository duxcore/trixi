const path = require('path');
const webpack = require('webpack')

module.exports = {
  entry: './lib/lib/createClient.js',
  
  output: {
    path: 'dist',
    filename: 'trixi.js',
    libraryTarget: "var",
    library: 'trixi',
  },
  optimization: {
    minimize: false
  },
};