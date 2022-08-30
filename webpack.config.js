const webpack = require("webpack");
const fs = require("fs");
const ConcatSource = require("webpack-sources").ConcatSource;
const path = require("path");

/**
 * 添加前缀注释
 */
class BannerPlugin {
  apply(compiler) {
    let banner = "";
    const entryFile = compiler.options.entry.main.import[0];

    const res = fs.readFileSync(entryFile, "utf-8");
    const matched = res.match(
      /(\/\/\s==UserScript==)(?<content>(\n.+)+)(\n\/\/\s==\/UserScript==)/
    );
    if (matched && matched.groups.content) {
      banner =
        "// ==UserScript==" + matched.groups.content + "\n// ==/UserScript==\n";
    }
    compiler.hooks.emit.tap("BannerPlugin", (compilation) => {
      compilation.chunks.forEach((chunk) => {
        // 最终生成的文件的集合
        chunk.files.forEach((fileName) => {
          compilation.assets[fileName] = new ConcatSource(
            banner,
            compilation.assets[fileName]
          );
        });
      });
    });
  }
}

const config = {
  entry: "./src/index.js",

  output: {
    clean: true,
    iife: true,
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
  // 脚本发布后，会被举报，不允许压缩
  optimization: {
    minimize: false,
  },
  externals: {
    react: "react",
    "react-dom": "reactDOM",
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
      {
        test: /\.ts(x)?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new BannerPlugin()],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};

module.exports = config;
