const withLess = require("@zeit/next-less");
const withImages = require("next-images");

module.exports = withImages(
  withLess({
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
    },
  })
);
