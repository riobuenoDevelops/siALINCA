const withLess = require("@zeit/next-less");
const withImages = require("next-images");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = withImages(
  withLess({
    webpack5: false,
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.target = 'electron-renderer';
      }

      config.module.rules.push(
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        });

      return config;
    },
    lessLoaderOptions: {
      lessOptions: {
        javascriptEnabled: true,
        modifyVars: {
          "@base-color": "#00B3EB",
          "@warning-color": "#FF8727",
          "@warning-light-color": "#FFB785",
        },
      },
    },
    env: {
      guestUserEmail: "invitado@invitado.com",
      guestUserPassword: "",
    },
    async redirects() {
      return [
        {
          source: "/",
          destination: "/login",
          permanent: true,
        },
      ];
    }
  }
  ));
