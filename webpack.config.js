var path = require('path');
var { CleanWebpackPlugin } = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var Dotenv = require('dotenv-webpack');
var HtmlWebpackPlugin = require("html-webpack-plugin");

var fileExtensions = ["jpg", "jpeg", "png", "gif", "eot", "otf", "svg", "ttf", "woff", "woff2"];

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    'init-app': path.join(__dirname, "assets", "js", "init-app.js"),
    'background-api': path.join(__dirname, "assets", "js", "background-api.js"),
    'popup': path.join(__dirname, "assets", "js", "popup.js"),
    'options': path.join(__dirname, "assets", "js", "options.js")
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "js/[name].js",
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env']
            ],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      },
      {
        test: new RegExp('.(' + fileExtensions.join('|') + ')$/i'),
        loader: "file-loader",
        options: {
          outputPath: 'images',
          name: '[name].[ext]',
        },
      }
    ]
  },
  devtool: 'cheap-source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "manifest.json",
          transform: function (content, path) {
            // generates the manifest file using the package.json informations
            return Buffer.from(JSON.stringify({
              description: process.env.npm_package_description,
              version: process.env.npm_package_version,
              ...JSON.parse(content.toString())
            }))
          }
        },
        { from:'assets/images', to:'img' },
        { from: 'background.js', to: 'background.js'}
      ]
    }),
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "view", "popup.html"),
      filename: "popup.html",
      chunks: ["popup"]
    })
  ]
};