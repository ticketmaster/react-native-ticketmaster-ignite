const {
  AndroidConfig,
  withAppBuildGradle,
  withGradleProperties,
  withProjectBuildGradle,
  withStringsXml,
  withPodfileProperties,
  withDangerousMod,
} = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

// Kotlin is pinned for the Ticketmaster SDK — see docs/expo.md for the rationale.
const KOTLIN_VERSION = '2.2.21';

module.exports = function withIgnitePlugin(expoConfig) {
  withGradleProperties(expoConfig, (config) => {
    config.modResults = config.modResults.filter(
      (item) =>
        !(item.type === 'property' && item.key === 'android.kotlinVersion')
    );
    config.modResults.push({
      type: 'property',
      key: 'android.kotlinVersion',
      value: KOTLIN_VERSION,
    });
    return config;
  });

  withProjectBuildGradle(expoConfig, (config) => {
    config.modResults.contents = config.modResults.contents.replace(
      "classpath('org.jetbrains.kotlin:kotlin-gradle-plugin')",
      `classpath('org.jetbrains.kotlin:kotlin-gradle-plugin:${KOTLIN_VERSION}')`
    );
    return config;
  });

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

  // Xcode 27 treats deployment-target warnings as hard errors. Third-party
  // pods (e.g. RNSVG) often ship with a lower IPHONEOS_DEPLOYMENT_TARGET than
  // the minimum Xcode accepts (15.0). This post_install hook raises every pod
  // target to at least 15.0 to prevent build failures.
  withDangerousMod(expoConfig, [
    'ios',
    async (config) => {
      const podfilePath = path.join(
        config.modRequest.platformProjectRoot,
        'Podfile'
      );
      let podfileContents = fs.readFileSync(podfilePath, 'utf-8');

      const deploymentTargetFix = `
    # Fix for Xcode 27: deployment target warnings are now hard errors.
    # Force all pods to meet the minimum iOS version (15.0).
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        if config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'].to_f < 15.0
          config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '15.0'
        end
      end
    end`;

      if (
        !podfileContents.includes("IPHONEOS_DEPLOYMENT_TARGET'].to_f < 15.0")
      ) {
        podfileContents = podfileContents.replace(
          /post_install do \|installer\|/,
          `post_install do |installer|${deploymentTargetFix}`
        );
        fs.writeFileSync(podfilePath, podfileContents);
      }

      return config;
    },
  ]);

  return expoConfig;
};
