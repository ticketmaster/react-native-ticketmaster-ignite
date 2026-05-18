const path = require('path');
const pkg = require('../package.json');

module.exports = {
  project: {
    android: {
      sourceDir: 'android',
    },
    ios: {
      sourceDir: 'ios',
      automaticPodsInstallation: true,
    },
  },
  dependencies: {
    [pkg.name]: {
      root: path.join(__dirname, '..'),
    },
  },
};
