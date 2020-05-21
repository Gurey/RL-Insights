module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: "./src/main/main.ts",
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    alias: { "react-dom": "@hot-loader/react-dom" },
  },
  // // Put your normal webpack config below here
  module: {
    rules: require("./webpack.rules"),
  },
};
