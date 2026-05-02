const { override, addWebpackAlias } = require("customize-cra");
const path = require("path");

module.exports = override(
  addWebpackAlias({
    "@mui/material": path.resolve(
      __dirname,
      "node_modules/@mui/material"
    ),
  }),
  (config) => {
    config.optimization.splitChunks = {
      cacheGroups: {
        mui: {
          test: /[\\/]node_modules[\\/]@mui[\\/]/,
          name: "mui",
          chunks: "all",
        },
      },
    };
    config.output.publicPath = "/smart-fund-manager/";
    return config;
  }
);