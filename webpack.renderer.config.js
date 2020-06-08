module.exports = {
  // Put your normal webpack config below here
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".py"],
    alias: { "react-dom": "@hot-loader/react-dom" },
  },
  module: {
    rules: require("./webpack.rules"),
  },
};
