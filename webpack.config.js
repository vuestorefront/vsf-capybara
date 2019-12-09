const merge = require("webpack-merge");

// You can extend default webpack build here.
// Read more in docs: https://github.com/DivanteLtd/vue-storefront/blob/master/docs/guide/core-themes/webpack.md
module.exports = function(config) {
  return merge(config, {
    default: {
      resolve: {
        alias: {
          "@storefront-ui/vue": "@storefront-ui/vue/packages/vue"
        }
      }
    }
  });
};
