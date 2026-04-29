const {
  AndroidConfig,
  withAppBuildGradle,
  withStringsXml,
  withPodfileProperties,
} = require('@expo/config-plugins');

module.exports = function withIgnitePlugin(expoConfig) {
  withAppBuildGradle(expoConfig, (config) => {
    const buildGradleUpdates = [
      `buildFeatures {`,
      `dataBinding = true`,
      `}`,
      `compileOptions {`,
      `coreLibraryDesugaringEnabled true`,
      `}`,
    ].join('\n');

    config.modResults.contents = config.modResults.contents.replace(
      `android {`,
      `android {\n${buildGradleUpdates}`
    );

    config.modResults.contents = config.modResults.contents.replace(
      `compileSdk rootProject.ext.compileSdkVersion`,
      `compileSdk 36`
    );

    config.modResults.contents = config.modResults.contents.replace(
      `minSdkVersion rootProject.ext.minSdkVersion`,
      `minSdkVersion 28`
    );

    config.modResults.contents = config.modResults.contents.replace(
      `dependencies {`,
      `dependencies {\ncoreLibraryDesugaring 'com.android.tools:desugar_jdk_libs:2.1.3'\n`
    );

    return config;
  });

  withStringsXml(expoConfig, (modConfig) => {
    const isModernAccounts = false;
    const isSportXr = false;
    const modernAccountsSchemes = [''];
    const sportXRSchemes = [''];

    if (isModernAccounts) {
      modernAccountsSchemes.forEach((value, index) => {
        modConfig.modResults = AndroidConfig.Strings.setStringItem(
          [
            {
              _: value,
              $: {
                name: `${
                  index === 0
                    ? 'app_tm_modern_accounts_scheme'
                    : `app_tm_modern_accounts_scheme_${index + 1}`
                }`,
              },
            },
          ],
          modConfig.modResults
        );
      });
    } else if (isSportXr) {
      sportXRSchemes.forEach((value, index) => {
        modConfig.modResults = AndroidConfig.Strings.setStringItem(
          [
            {
              _: value,
              $: {
                name: `${
                  index === 0
                    ? 'app_tm_sportxr_scheme'
                    : `app_tm_sportxr_scheme_${index + 1}`
                }`,
              },
            },
          ],
          modConfig.modResults
        );
      });
    }

    return modConfig;
  });

  withPodfileProperties(expoConfig, (config) => {
    config.modResults['ios.deploymentTarget'] = '17.0';
    return config;
  });

  return expoConfig;
};
