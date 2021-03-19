const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

var fileExtensions = ["jpg", "jpeg", "png", "gif", "eot", "otf", "svg", "ttf", "woff", "woff2"];

module.exports = {
  mode: process.env.NODE_ENV || "development",
  entry: {
    popup: path.join(__dirname, "src", "js", "popup.js"),
    options: path.join(__dirname, "src", "js", "options.js"),
    background: path.join(__dirname, "src", "js", "background.js")
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "[name].bundle.js"
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
              ['@babel/preset-env', { targets: "defaults" }]
            ],
          }
        }
      },
      {
        test: /\.((c|sa|sc)ss)$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: env.NODE_ENV === 'production' ? true : false,
              outputStyle: "compressed"
            }
          }
        ],  
        
    },
      {
        test: new RegExp('.(' + fileExtensions.join('|') + ')$'),
        loader: "file-loader?name=[name].[ext]",
        exclude: /node_modules/
      },
      { 
          test: /\.hbs$/, 
          exclude: /(node_modules|bower_components)/,
          include: [
            path.resolve(__dirname, "storefront", "templates")
          ],
          use: [
              {
                  loader: "handlebars-loader",
                  query: {
                      helperDirs: path.resolve(__dirname, "./storefront"),
                  }
              }
          ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
        patterns: [
            { from:'images', to:'img' }
        ],
    }),
    new Dotenv()
  ]
};