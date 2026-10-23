Here is an example config plugin for an Expo (Continuous Native Generation) app using this library, kept in line with the demo app's plugin at [`/expo/withIgnitePlugin.js`](../expo/withIgnitePlugin.js) (Expo SDK 58 / React Native 0.88).

Create a file called `withIgnitePlugin.js` and paste in the below code

```javascript
const {
  AndroidConfig,
  withAppBuildGradle,
  withStringsXml,
  withPodfileProperties,
} = require('@expo/config-plugins');

module.exports = function withIgnitePlugin(expoConfig) {
  withAppBuildGradle(expoConfig, (config) => {
  
    const buildGradleUpdates = [`buildFeatures {`, `dataBinding = true`, `}`, `compileOptions {`, `coreLibraryDesugaringEnabled true`, `}`].join(
      "\n"
    );

    config.modResults.contents = config.modResults.contents.replace(
      `android {`,
      `android {\n${buildGradleUpdates}`
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
    const isModernAccounts = false
    const isSportXr = false
    const modernAccountsSchemes = [''];
    const sportXRSchemes = [''];
    
    if(isModernAccounts) {
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
                    ? 'app_tm_sportxr_scheme'
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

  withPodfileProperties(expoConfig, (config) => {
    config.modResults['ios.deploymentTarget'] = '17.0';
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

You will need to update `isModernAccounts` or `isSportXr` to `true` and add all your schemes to the respective array in `withStringsXml()` for Android. **If you skip this, the login screen opens but never redirects back into your app after authenticating** — i.e. login appears to do nothing. The scheme value comes from your Ticketmaster developer app settings.

If you have a Modern Accounts Scheme you would have the below:

```typescript
const isModernAccounts = true
const modernAccountsSchemes = ["myScheme"];
```

or for an Android app with multiple API keys:

```typescript
const isModernAccounts = true
const modernAccountsSchemes = ["firstScheme", "secondScheme"];
```

You can update `withIgnitePlugin.js`'s values for the iOS deployment target, `minSdkVersion`, desugaring etc. to the values needed for your project.

The Ticketmaster SDK's Android artifacts require `compileSdk` **36 or newer**. Expo SDK 58 defaults to `compileSdk 37`, so the plugin no longer overrides it (forcing `36` would now be a downgrade). On an Expo SDK whose default is lower than 36, raise it through the `android.compileSdkVersion` Gradle property (for example with [`expo-build-properties`](https://docs.expo.dev/versions/latest/sdk/build-properties/) or a `withGradleProperties` mod) rather than editing `android/app/build.gradle`.


### Troubleshooting  

**Kotlin version — required for Ticketmaster SDK `3.18.0`+:** the SDK pulls in `kotlin-stdlib:2.3.0`, which needs a **Kotlin 2.2.0 or newer** compiler to read its metadata (a 2.2.x or higher compiler reads 2.3.0 metadata via Kotlin's forward-compatibility). Expo SDK 58 / React Native 0.88 already resolve a 2.2.x compiler by default (React Native's Gradle plugin declares Kotlin 2.2.0 and AGP 9.2.1 brings in the 2.2.10 Kotlin Gradle plugin), so the demo plugin no longer pins Kotlin. On Expo SDK 57 and older the default compiler is `2.1.20`, and without a pin Android builds fail compiling the `:react-native-ticketmaster-ignite` (and `:react-native-safe-area-context`) Kotlin — e.g. `:react-native-ticketmaster-ignite:compileDebugKotlin` errors with `the binary version of its metadata is 2.3.0, expected version is 2.1.0`. Because the native `android/` directory is regenerated by `expo prebuild`, the pin must be set through the config plugin — editing `android/gradle.properties` or `android/build.gradle` directly won't survive a prebuild. Choose a version compatible with your Expo SDK's bundled KSP and Compose compiler plugin versions (this repo used `2.2.21` while on SDK 56).

If you need the pin, apply it in two mods. `withGradleProperties` sets the `android.kotlinVersion` property — Expo maps it onto the version-catalog `kotlin` entry, which drives `rootProject.ext.kotlinVersion` (consumed by the library module) plus the Compose compiler plugin / KSP versions. `withProjectBuildGradle` then pins the root buildscript's `kotlin-gradle-plugin` classpath, which templates up to SDK 57 declare version-less so it would otherwise resolve to RN's transitive `2.1.20` — there, setting the property alone isn't enough. (The SDK 58 template reads `android.kotlinVersion` for that classpath itself, so on SDK 58+ the property alone suffices and the `replace()` below finds nothing to change.)

```javascript
const {
  withGradleProperties,
  withProjectBuildGradle,
} = require('@expo/config-plugins');

const KOTLIN_VERSION = '2.2.21';

// inside withIgnitePlugin():
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
```

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

#### Xcode 27: Deployment target errors

Xcode 27 treats deployment target warnings as hard errors. Some third-party pods (e.g., RNSVG) ship with `IPHONEOS_DEPLOYMENT_TARGET` lower than the minimum Xcode 27 accepts (15.0), causing builds to fail with errors like:

```
The iOS Simulator deployment target 'IPHONEOS_DEPLOYMENT_TARGET' is set to 12.4, but the range of supported deployment target versions is 15.0 to 26.0.99.
```

**Fix:** Add `withDangerousMod` to your config plugin to inject a `post_install` hook that raises all pod targets to at least iOS 15.0.

Add the imports at the top of your plugin:

```javascript
const {
  // ... existing imports ...
  withDangerousMod,
} = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');
```

Then add this block before `return expoConfig;`:

```javascript
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

    if (!podfileContents.includes("IPHONEOS_DEPLOYMENT_TARGET'].to_f < 15.0")) {
      podfileContents = podfileContents.replace(
        /post_install do \|installer\|/,
        `post_install do |installer|${deploymentTargetFix}`
      );
      fs.writeFileSync(podfilePath, podfileContents);
    }

    return config;
  },
]);
```

This fix is applied automatically via the config plugin and survives `expo prebuild`.

The two `expo-modules-jsi` fixes below are only needed on Expo SDK 56 and 57 (`expo-modules-jsi` 56.x / 57.x). `expo-modules-jsi` 58.0.17 (Expo SDK 58) ships both fixes upstream — its `build-xcframework.sh` strips the `__ObjC::` module-selector form and the Swift setter call was restructured — so the demo app no longer carries a patch and builds unmodified on Xcode 27.1.

#### Xcode 27 / Swift 6: C function pointer inference error

Xcode 27 ships with Swift 6, which has stricter type inference for `@convention(c)` function pointers. This can cause `expo-modules-jsi` to fail with:

```
error: cannot infer '@convention(c)' function pointer type: use an explicit type instead
```

**Fix:** Manually patch `node_modules/expo-modules-jsi/apple/Sources/ExpoModulesJSI/Runtime/JavaScriptRuntime.swift`. Around line 214-220, find:

```swift
let callbacks = expo.HostObjectCallbacks(
  context, getter, set == nil ? nil : setter, propertyNamesGetter, deallocate)
```

And change it to:

```swift
let setterPointer: (@convention(c) (UnsafeMutableRawPointer, UnsafePointer<CChar>, UnsafeMutableRawPointer) -> Void)? = setter
let callbacks = expo.HostObjectCallbacks(
  context, getter, set == nil ? nil : setterPointer, propertyNamesGetter, deallocate)
```

#### Xcode 27: `cannot find type '__ObjC::expo' in scope`

Xcode 27 writes C++ types in `.swiftinterface` files as `__ObjC::expo...` instead of `__ObjC.expo...`, so `expo-modules-jsi`'s build script no longer strips them and the build fails with:

```
ExpoModulesJSI.swiftinterface:289:19: error: cannot find type '__ObjC::expo' in scope
extension __ObjC::expo.__ObjC::CppError : Swift::Error {
```

**Fix:** In `node_modules/expo-modules-jsi/apple/scripts/build-xcframework.sh`, add `/^extension __ObjC::/,/^}/d;` to the `sed` command (around line 290):

```sh
sed '/^extension __ObjC\./,/^}/d;/^extension __ObjC::/,/^}/d;/^@usableFromInline$/{N;/_ConstraintThatIsNotPartOfTheAPIOfThisLibrary/d;};/_ConstraintThatIsNotPartOfTheAPIOfThisLibrary/d' "$swiftinterface" > "$stripped_swiftinterface"
```

Both `expo-modules-jsi` patches above must be reapplied after `yarn install` wipes `node_modules`. To make them permanent, use `yarn patch expo-modules-jsi` (yarn berry) or [patch-package](https://github.com/ds300/patch-package) (classic yarn/npm). The demo app applied both via a yarn patch while it was on SDK 56; the patch was removed in the SDK 58 upgrade because they are no longer needed.

