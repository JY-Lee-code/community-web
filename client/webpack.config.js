// webpack.config.js
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.jsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: [".js", ".jsx"]
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "public")
    },
    historyApiFallback: true,
    hot: true,
    port: 3000,
    proxy: [
      {
        context: ["/api", "/socket.io"],
        target: "http://localhost:4000",
        ws: true
      }
    ]
  }
};