const path = require('path');
const { getDefaultConfig } = require('@react-native/metro-config');
const { getConfig } = require('react-native-builder-bob/metro-config');
const pkg = require('../package.json');

const root = path.resolve(__dirname, '..');
const sharedRoot = path.resolve(root, 'shared');
const exampleNodeModules = path.resolve(__dirname, 'node_modules');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = getConfig(getDefaultConfig(__dirname), {
  root,
  pkg,
  project: __dirname,
});

// Ensure shared folder is watched
config.watchFolders = [...(config.watchFolders || []), sharedRoot];

// Ensure deps from shared/ resolve to example/node_modules/
config.resolver.nodeModulesPaths = [exampleNodeModules];

// Resolve @shared alias with custom resolver
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith('@shared/')) {
    const newModuleName = moduleName.replace('@shared/', sharedRoot + '/');
    return context.resolveRequest(context, newModuleName, platform);
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
