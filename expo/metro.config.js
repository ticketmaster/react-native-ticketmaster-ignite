const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '..');
const sharedRoot = path.resolve(monorepoRoot, 'shared');

const config = getDefaultConfig(projectRoot);

// Watch the monorepo root for changes
config.watchFolders = [monorepoRoot];

// Resolve modules from both the project and monorepo node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Resolve @shared alias
config.resolver.extraNodeModules = {
  '@shared': sharedRoot,
};

module.exports = config;
