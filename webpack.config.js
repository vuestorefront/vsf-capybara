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

module.exports = function (config, { isClient }) {
  const clientConfig = isClient ? {
    optimization: {
      splitChunks: {
        minSize: 0,
        cacheGroups: {
          commons: {
            name: 'commons',
            chunks: 'all',
            enforce: true,
            reuseExistingChunk: true,
            minChunks: 2,
            priority: 1
          },
          vue: {
            test: /[\\/]node_modules[\\/](vue|vuex|vue-router|vue-meta|vue-i18n|vuex-router-sync|vue-lazyload)[\\/]/,
            name: 'vue-common',
            chunks: 'all',
            reuseExistingChunk: true,
            enforce: true,
            priority: 1
          },
          core: {
            test: /[\\/]core[\\/]/,
            name: 'core',
            chunks: 'all',
            reuseExistingChunk: true,
            enforce: true,
            priority: 1
          },
          vendor: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 50000,
            test: /[\\/]node_modules[\\/]/,
            reuseExistingChunk: true,
            enforce: true,
            name (module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

              // npm package names are URL-safe, but some servers don't like @ symbols
              return `vendor-${packageName.replace('@', '')}`;
            }
          }
        }
      }
    }
  } : {}
  const mergedConfig = merge(
    // alias for 'src/modules/client' has to be the first one, because it has to be
    // handled earlier than already existing aliases in VSF (like general 'src' path)
    { resolve: { alias: { 'src/modules/client': `${themeRoot}/config/modules` } } },
    config, // default vsf config
    clientConfig
  );

  fixPostCSSPlugins(mergedConfig.module.rules);

  return mergedConfig;
};
