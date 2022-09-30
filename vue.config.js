const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");
const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
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
    workboxOptions: {
      skipWaiting: true
    }
  },
  configureWebpack: config => {
    config.experiments = {
      asyncWebAssembly: true,
    };

    config.plugins.push(...[new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    })]);

    //config.plugins.push(new HtmlWebpackPlugin());
    config.plugins.push(new CspHtmlWebpackPlugin({
      "base-uri": "'self'",
      "default-src": "'self'",
      "connect-src": "*",
      "script-src": ["'unsafe-inline'", "'self'", "'unsafe-eval'"],
      "style-src": ["'unsafe-inline'", "'self'", "'unsafe-eval'"],
      "img-src": ["'self'", "data:"],
      "font-src": ["'self'", "data:"],
      "media-src": "'self'",
      "object-src": "'self'",
      "child-src": "'self'",
      "frame-src": "'self'",
      "worker-src": "*",
      // "frame-ancestors": "'self'", // not work in meta
      "form-action": "'self'",
      "upgrade-insecure-requests": "",
      "block-all-mixed-content": "",
      "manifest-src": "'self'"
    }));

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
  }
});
