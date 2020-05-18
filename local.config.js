const merge = require('lodash/merge')
const semverSatisfies = require('semver/functions/satisfies')

/**
 * This is the base configuration for Capybara theme that is common and valid
 * for all supported Vue Storefront versions. Any new configuration options
 * which will be used in all installations regardless of Vue Storefront
 * version should be added here.
 */
const configBase = {
  'theme': '@vue-storefront/theme-capybara',
  'products': {
    'thumbnails': {
      'width': 324,
      'height': 489
    }
  },
  'cart': {
    'thumbnails': {
      'width': 210,
      'height': 300
    }
  },
  'entities': {
    'category': {
      'categoriesDynamicPrefetch': false
    }
  },
  'quicklink': {
    'enabled': false
  }
}

/**
 * This object contains key-value pairs of custom/specific configuration options
 * per matching Vue storefront version. Each key is a semver range about Vue
 * Storefront version which supports these new options. Each value is a separate
 * object cloned from base config and optionally extended by new configuration
 * options supported by that particular Vue Storefront version.
 */
const configVariants = {
  '~1.11.0': merge({}, configBase),
  '^1.12.0': merge({}, configBase, {
    'server': {
      'api': 'api-search-query'
    },
    'entities': {
      'attribute': {
        'loadByAttributeMetadata': true
      }
    },
    'urlModule': {
      'enableMapFallbackUrl': true
    }
  })
}

/**
 * Find and return first configuration that satisfies semver range for current
 * Vue Storefront version.
 */
module.exports = function (vsfVersion) {
  const matchedConfigVersion = Object
    .keys(configVariants)
    .find(configVersion => semverSatisfies(vsfVersion, configVersion, { includePrerelease: true }))

  return matchedConfigVersion ? configVariants[matchedConfigVersion] : null
};
