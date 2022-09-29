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
    name: "Veil Wallet",
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
  },
  chainWebpack: (config) => {
    // set environment variables
    config.plugin("define").tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_I18N_FULL_INSTALL__: JSON.stringify(true),
        __INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_I18N_LEGACY_API__: JSON.stringify(false),
      });

      return definitions;
    });
  },
});
