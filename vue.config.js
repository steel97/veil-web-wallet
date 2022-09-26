const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");
const childProcess = require("child_process"); let lastCommitHash = ""; try {
  lastCommitHash = childProcess
    .execSync("git rev-parse --short HEAD")
    .toString()
    .trim();
} catch (e) {
  console.error(e);
}

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "./",
  pwa: {
    themeColor: "#FFFFFF",
    appleMobileWebAppCapable: "yes",

  },
  configureWebpack: config => {
    config.experiments = {
      asyncWebAssembly: true,
    };

    config.plugins.push(...[new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    })]);

    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env": {
          VUE_APP_COMMIT_HASH: JSON.stringify(lastCommitHash),
        },
      }),
    );

    config.resolve.fallback = {
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer")
    };
  }
});
