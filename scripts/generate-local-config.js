#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const semverInc = require('semver/functions/inc')

const vsfInstallationDir = path.resolve(__dirname, '..', '..', '..', '..');
const vsfPackageJsonPath = path.resolve(vsfInstallationDir, 'package.json');
const themeInstallationDir = path.resolve(__dirname, '..');
const themeLocalConfigJsPath = path.resolve(themeInstallationDir, 'local.config.js');
const themeLocalJsonPath = path.resolve(themeInstallationDir, 'local.json');

/**
 * Supported parameters:
 * (no parameter)   - Takes Vue Storefront version from package.json from installation directory
 *                    directly as it is defined there and creates local.json configuration.
 * --next           - Increments Vue Storefront version from package.json to next minor version
 *                    (this is useful if installed Vue Storefront already contains latest changes
 *                    but they are not officially released yet, so version is package.json is still
 *                    the previous one). Incremented Vue Storefront version is then used during
 *                    creation of local.json configuration.
 */
const parameter = process.argv[2]

try {
  const vsfVersionFromPackageJson = JSON.parse(fs.readFileSync(vsfPackageJsonPath)).version
  const vsfVersion = parameter === '--next'
    ? semverInc(vsfVersionFromPackageJson, 'minor')
    : vsfVersionFromPackageJson

  const themeLocalJson = fs.existsSync(themeLocalConfigJsPath)
    ? require(themeLocalConfigJsPath)(vsfVersion)
    : null

  if (themeLocalJson) {
    fs.writeFileSync(themeLocalJsonPath, JSON.stringify(themeLocalJson, null, 2))
  }
} catch (e) {
  console.error(`Problem with generating local.json configuration\n`, e)
}
