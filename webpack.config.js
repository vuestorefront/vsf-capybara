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
  /**
   * This webpack config depends on the build type: for development build it is wrapped inside 'default' key
   * but for production build this 'default' key does not exist. This misconfiguration should be fixed in
   * Vue Storefront v1.11.1 and then 'hasDefaultKey' will never be true, so all these lines could be then
   * simplified/removed.
   */

  const hasDefaultKey = config.default !== undefined; // TODO: remove after Vue Storefront v1.11.1 release

  const optimization = {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/](vue|vuex|vue-router|vue-meta|vue-i18n|vuex-router-sync|localforage|@storefront-ui)[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  }

  const mergedConfig = merge(
    { resolve: { alias: { 'src/modules/client': `${themeRoot}/config/modules` } } },
    hasDefaultKey ? config.default : config, // TODO: simplify after Vue Storefront v1.11.1 release
    { optimization }
  );

  fixPostCSSPlugins(mergedConfig.module.rules);

  return hasDefaultKey // TODO: simplify after Vue Storefront v1.11.1 release
    ? { default: mergedConfig }
    : mergedConfig;
};
