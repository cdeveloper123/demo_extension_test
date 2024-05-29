const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const fs = require("fs");

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      return {
        ...webpackConfig,
        entry: {
          main: [
            env === "development" &&
              require.resolve("react-dev-utils/webpackHotDevClient"),
            paths.appIndexJs,
          ].filter(Boolean),
          content: paths.appSrc + "/chrome-services/content.ts",
          background: paths.appSrc + "/chrome-services/background.ts"
        },
        output: {
          ...webpackConfig.output,
          filename: "static/js/[name].js",
        },
        optimization: {
          ...webpackConfig.optimization,
          runtimeChunk: false,
        },
        plugins: [
          ...webpackConfig.plugins,
          new HtmlWebpackPlugin({
            inject: true,
            chunks: ["options"],
            template: paths.appHtml,
            filename: "options.html",
          }),
          {
            apply: (compiler) => {
              compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
                const outputPath = path.resolve(__dirname, 'build', 'manifest.json');
                const manifest = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
                manifest.background = {
                  service_worker: './static/js/background.js'
                };
                fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
              });
            }
          }
        ],
      };
    },
  },
};
