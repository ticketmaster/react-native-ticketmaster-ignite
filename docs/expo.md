Here is a config plugin created for an Expo app on Expo 52.

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
    const lineChanges = [`buildFeatures {`, `dataBinding = true`, `}`].join(
      '\n'
    );

    config.modResults.contents = config.modResults.contents.replace(
      `android {`,
      `android {\n${lineChanges}`
    );

    return config;
  });

  withStringsXml(expoConfig, (config) => {
    const schemes = ['sampleScheme'];

    schemes.forEach((value, index) => {
      config.modResults = AndroidConfig.Strings.setStringItem(
        [
          {
            _: value,
            $: {
              name: `${
                index === 0
                  ? 'app_tm_modern_accounts_scheme'
                  : `app_tm_modern_accounts_scheme_${index + 2}`
              }`,
            },
          },
        ],
        config.modResults
      );
    });

    return config;
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

You will need to update the array of schemes in `withIgnitePlugin.js` to all the Ignite SDK schemes you have for android.

You can update `withIgnitePlugin.js`'s values for iOS deployment target, compileSdkVersion etc. to the values needed for your project.
