// You can extend default webpack build here.
// Read more in docs: https://github.com/DivanteLtd/vue-storefront/blob/master/docs/guide/core-themes/webpack.md
const merge = require('webpack-merge');
const themeRoot = require('@vue-storefront/core/build/theme-path');
const filterStream = require('postcss-filter-stream');

/**
 * Searches for given plugin name and wraps it with 'postcss-filter-stream' plugin to configure
 * paths that must be skipped for requested plugin.
 *
 * @param {object} loader
 * @param {string} pluginName
 * @param {string} filter
 */
function addFilterStreamForPostCSSPlugin (loader, pluginName, filter) {
  const plugins = loader.options.plugins instanceof Function
    ? loader.options.plugins()
    : loader.options.plugins;
  const index = plugins.findIndex(plugin => plugin().postcssPlugin === pluginName);

  if (index !== -1) {
    plugins[index] = filterStream(filter, plugins[index]());
    loader.options.plugins = loader.options.plugins instanceof Function
      ? () => plugins
      : plugins;
  }
}

/**
 * Traverses webpack's module rules to find all PostCSS loaders. For each PostCSS loader
 * the 'postcss-flexbugs-fixes' plugin has to be found and it has to be configured to skip
 * @storefront-ui library from being processed.
 *
 * @param {object} rules
 */
function fixPostCSSPlugins (rules) {
  const processedLoaders = [];

  rules.forEach(rule => {
    const loader = rule.use ? rule.use.find(item => item.loader === 'postcss-loader') : null;

    if (loader && !processedLoaders.includes(loader)) {
      addFilterStreamForPostCSSPlugin(loader, 'postcss-flexbugs-fixes', '**/@storefront-ui/**');
      processedLoaders.push(loader);
    }
  });
}

module.exports = function (config) {
  const mergedConfig = merge({
    default: {
      resolve: {
        alias: {
          'src/modules/client': `${themeRoot}/config/modules`
        }
      }
    }
  }, config);

  fixPostCSSPlugins(mergedConfig.default.module.rules);

  return mergedConfig;
};
