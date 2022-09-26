const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");

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

    config.resolve.fallback = {
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer")
    };
  }
});
