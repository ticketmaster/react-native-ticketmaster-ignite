Here is a config plugin created for an Expo app on Expo 52 against NPM Ignite version `2.8.5`.

Create a file called `withIgnitePlugin.js` and paste in the below code

```javascript
const {
  AndroidConfig,
  withAppBuildGradle,
  withStringsXml,
  withProjectBuildGradle,
  withPodfileProperties,
} = require('@expo/config-plugins');

module.exports = function withIgnitePlugin(expoConfig) {
  withAppBuildGradle(expoConfig, (config) => {
    const buildGradleUpdates1 = [`buildFeatures {`, `dataBinding = true`, `}`, `compileOptions {`, `coreLibraryDesugaringEnabled true`, `}`].join(
      "\n"
    );

    config.modResults.contents = config.modResults.contents.replace(
      `android {`,
      `android {\n${buildGradleUpdates1}`
    );

    config.modResults.contents = config.modResults.contents.replace(
      `dependencies {`,
      `dependencies {\ncoreLibraryDesugaring 'com.android.tools:desugar_jdk_libs:2.1.3'\n`
    );

    return config;
  });

  withStringsXml(expoConfig, (modConfig) => {
    const isModernAccounts = false
    const isSportXr = false
    const modernAccountsSchemes = ["sampleScheme"];
    const sportXRSchemes = [""];
    
    if(isModernAccounts) {
      modernAccountsSchemes.forEach((value, index) => {
        modConfig.modResults = AndroidConfig.Strings.setStringItem(
          [
            {
              _: value,
              $: {
                name: `${
                  index === 0
                    ? "app_tm_modern_accounts_scheme"
                    : `app_tm_modern_accounts_scheme_${index + 1}`
                }`
              }
            }
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
                    ? "app_tm_sportxr_scheme"
                    : `app_tm_sportxr_scheme_${index + 1}`
                }`
              }
            }
          ],
          modConfig.modResults
        );
      });
    }

    return modConfig;
  });

  withProjectBuildGradle(expoConfig, (config) => {
    config.modResults.contents = config.modResults.contents.replace(
      `minSdkVersion = Integer.parseInt(findProperty('android.minSdkVersion') ?: '24')`,
      `minSdkVersion = 26`
    );
    config.modResults.contents = config.modResults.contents.replace(
      `compileSdkVersion = Integer.parseInt(findProperty('android.compileSdkVersion') ?: '35')`,
      `compileSdkVersion = 35`
    );

    return config;
  });

  withPodfileProperties(expoConfig, (config) => {
    config.modResults['ios.deploymentTarget'] = '15.1';
    return config;
  });

  return expoConfig;
};
```

You can then add the config plugin to your array of plugins in `app.json`

```json
    "plugins": [
      ...
      "./withIgnitePlugin"
      ...
    ],
```

You will need to update one of `isModernAccounts` or `isSportXr` booleans to true and add all your schemes to the respective array of schemes in `withStringsXml()`for android.

You can update `withIgnitePlugin.js`'s values for iOS deployment target, compileSdkVersion etc. to the values needed for your project.


### Troubleshooting  

#### Expo 53

Depending on your expo version, changing the `minSdkVersion` and `compileSdkVersion` will need to be done in `withAppBuildGradle()` instead of `withProjectBuildGradle()`, which can be done by adding the below to `withAppBuildGradle()`:

```javascript

config.modResults.contents = config.modResults.contents.replace(
      `compileSdk rootProject.ext.compileSdkVersion`,
      `compileSdk 35`
    );

config.modResults.contents = config.modResults.contents.replace(
      `minSdkVersion rootProject.ext.minSdkVersion`,
      `minSdkVersion 28`
    );
```

The `withProjectBuildGradle()` can then be completely removed from the file.


#### Koin dependency issues 

If you face any Koin dependency issues you can add the below inside `withProjectBuildGradle()` to force koin versions in your project to a specific version 

```javascript
    const projectGradleUpdates = [`configurations.all {`, `resolutionStrategy {`, `force "io.insert-koin:koin-android:4.0.2"`, `force "io.insert-koin:koin-core:4.0.2"
      `, `eachDependency { details ->`, `if (details.requested.group == "io.insert-koin" && details.requested.name == "koin-android") {`, `details.useVersion "4.0.2"`, `}`,`if (details.requested.group == "io.insert-koin" && details.requested.name == "koin-core") {`, `details.useVersion "4.0.2"`, `}`, `}`, `}`, `}`].join(
            "\n"
          );
      
      config.modResults.contents = config.modResults.contents.replace(
      `allprojects {`,
      `allprojects {\n${projectGradleUpdates}`
    );

```

Update all references of `4.0.2` to the desired version 

It has been reported that the inclusion of `expo-dev-client` may cause crashes for Android, you can try removing this library if you experience problems.

