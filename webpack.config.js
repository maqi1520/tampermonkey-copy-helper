const webpack = require("webpack");
const path = require("path");

var __webpack_nonce__ = "";

const config = {
  entry: "./src/index.js",
  output: {
    clean: true,
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
            options: {
              attributes: {
                nonce: true,
              },
            },
          },
          { loader: "css-loader" },
        ],
      },
    ],
  },
};

module.exports = config;
