// You can extend default webpack build here.
// Read more in docs: https://github.com/DivanteLtd/vue-storefront/blob/master/docs/guide/core-themes/webpack.md
const merge = require('webpack-merge');
const themeRoot = require('@vue-storefront/core/build/theme-path');

module.exports = function (config) {
  return merge({
    default: {
      resolve: {
        alias: {
          'src/modules/client': `${themeRoot}/config/modules`
        }
      }
    }
  }, config);
};
