var path = require('path');
var { CleanWebpackPlugin } = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var Dotenv = require('dotenv-webpack');
var HtmlWebpackPlugin = require("html-webpack-plugin");
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

var fileExtensions = ["jpg", "jpeg", "png", "svg"];

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    'init-app': path.join(__dirname, "assets", "js", "init-app.js"),
    'popup': path.join(__dirname, "assets", "js", "popup.js")
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
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resourcePath, context) => {
                // publicPath is the relative path of the resource to the context
                // e.g. for ./css/admin/main.css the publicPath will be ../../
                // while for ./css/main.css the publicPath will be ../
                return path.relative(path.dirname(resourcePath), context) + '/';
              },
            }
          },
          "css-loader",
          "resolve-url-loader",
          "sass-loader"
        ],  
      },
      {
        test: /\.(png|jpe?g|svg)$/i,
        loader: "file-loader",
        options: {
          name: 'img/[name].[ext]',
        },
      }
    ]
  },
  devtool: 'cheap-source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
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
        { from:'assets/img', to:'img' },
        { from: 'background.js', to: 'background.js'}
      ]
    }),
    new Dotenv({
      path: process.env.NODE_ENV === 'production' ? path.join(__dirname, '.env.prod') : (process.env.NODE_ENV === 'development' ? path.join(__dirname, '.env.dev') : path.join(__dirname, '.env.local'))
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "view", "popup.html"),
      filename: "popup.html",
      chunks: ["popup"]
    })
  ]
};