module.exports = {
  "*.{js,vue,ts}": ["cross-env NODE_ENV=production eslint --fix", "git add"]
};
