![tm-developer-logo](https://github.com/user-attachments/assets/c5835fc2-f1b8-413c-af9d-4449cdf1d24b)

# react-native-ticketmaster-ignite
[![current react-native-ticketmaster-ignite package version](https://img.shields.io/npm/v/react-native-ticketmaster-ignite)](https://www.npmjs.com/package/react-native-ticketmaster-ignite) ![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/ticketmaster/react-native-ticketmaster-ignite/ci.yml?branch=main) [![released under the MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) ![PR's welcome!](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

This library serves as a wrapper for the three Ticketmaster Ignite SDK's: [Accounts](https://ignite.ticketmaster.com/docs/accounts-sdk-overview), [Retail](https://ignite.ticketmaster.com/docs/retail-sdk-overview) and [Tickets](https://ignite.ticketmaster.com/docs/tickets-sdk-overview).

In order to use the library, setup a developer account with Ticketmaster by contacting nexus_sdk@ticketmaster.com. When your account is activated you will receive an **API key** and **scheme** that you'll need to use to finish the setup.

<details open>
<summary><h2 style="display:inline-block">Installation</h2></summary>

Depending on your package manager you can install this library with one of the below commands:

#### NPM

```bash
npm install --save react-native-ticketmaster-ignite
```

#### Yarn
```bash
yarn add react-native-ticketmaster-ignite
```

#### Expo

```bash
npx expo install react-native-ticketmaster-ignite
```

If your project is an **Expo Managed Workflow** project then skip the "Setting up iOS" and "Setting up Android" sections and go straight to the [Setting up Expo](https://github.com/ticketmaster/react-native-ticketmaster-ignite?tab=readme-ov-file#setting-up-expo) section

</details>

<details open>
<summary><h2 style="display:inline-block">Setting up iOS</h2></summary>

Edit the `Podfile` and set the platform to `17.0`

```
platform :ios, '17.0'
```

- `cd` into the `ios` directory and run `pod install`

</details>

<details open>
<summary><h2 style="display:inline-block">Setting up Android</h2></summary>

#### Set the minSdkVersion and compileSdkVersion

In `android/build.gradle` set the `minSdkVersion` to `28` and set the `compileSdkVersion` to `36`.

#### Set the Kotlin version

> **⚠️ BREAKING CHANGE (v4.4.0+):** This library requires **Kotlin 2.2.0 or newer** due to the Ticketmaster Tickets SDK 3.18.0 dependency on `kotlin-stdlib:2.3.0`. React Native's default Kotlin compiler (2.1.20) **cannot** read 2.3.0 metadata and will fail with an "Internal compiler error" during the `:react-native-ticketmaster-ignite:compileDebugKotlin` task.
>
> **If you see compilation errors mentioning "metadata is 2.3.0, expected version is 2.1.0"**, you need to upgrade your Kotlin toolchain as shown below.

You must build with **Kotlin 2.2.0 or newer**. We recommend **Kotlin 2.2.21 or higher**.

In `android/build.gradle`, **set both** the `kotlinVersion` in `ext {}` **and** the `kotlin-gradle-plugin` classpath:

```groovy
buildscript {
    ext {
        // ...
        kotlinVersion = "2.2.21"  // Use 2.2.21 or higher
    }
    dependencies {
        // ...
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion")
    }
}
```

#### Set the login redirect scheme

The scheme is used formulate a deeplink which will be used by the android Ticketmaster login activity to deeplink back to your app after login.  

In your project go to `android/app/src/main/res/values/strings.xml` and if you are on Modern Accounts/Archtics add this snippet:

```xml
<string name="app_tm_modern_accounts_scheme">samplescheme</string>
```

And if you are on Sport XR add this snippet:

```xml
<string name="app_tm_sportxr_scheme">samplescheme</string>
```

Replace `samplescheme` with your scheme - you can find it in your Ticketmaster developer app settings.

#### Multi Scheme

If you have multiple schemes you can add them using the following format:

Modern Accounts/Archtics 
```xml
<string name="app_tm_modern_accounts_scheme">samplescheme1</string>
<string name="app_tm_modern_accounts_scheme_2">samplescheme2</string>
<string name="app_tm_modern_accounts_scheme_3">samplescheme3</string>
<string name="app_tm_modern_accounts_scheme_4">samplescheme4</string>
<string name="app_tm_modern_accounts_scheme_5">samplescheme5</string>
```

SportXR
```xml
<string name="app_tm_sportxr_scheme">samplescheme1</string>
<string name="app_tm_sportxr_scheme_2">samplescheme2</string>
<string name="app_tm_sportxr_scheme_3">samplescheme3</string>
<string name="app_tm_sportxr_scheme_4">samplescheme4</string>
<string name="app_tm_sportxr_scheme_5">samplescheme5</string>
```

You can set up to 30 Archtics or 30 SportXR schemes in total


#### allowBackup in AndroidManifest

Open the `AndroidManifest.xml` file and:

- make sure that the `manifest` contains `xmlns:tools="http://schemas.android.com/tools"`
- add `tools:replace="android:allowBackup"` to the `application` tag

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
          xmlns:tools="http://schemas.android.com/tools"
          package="com.yourpackage">

    <application tools:replace="android:allowBackup">
      <activity>
      ...
      </activity>
    </application>
</manifest>
```

If you notice login issues on Android, such as the login UI hanging once the sign in button has been pressed or `Couldn't generated a ModernAccounts object` seen in the logs in Android Studio add `tools:remove="android:taskAffinity"` to the `application` tag, rebuild the app and try logging in again.

#### Set dataBinding and coreLibraryDesugaringEnabled to true

In `android/app/build.gradle` add:

```groovy
android {
  ...
    buildFeatures {
        dataBinding = true
    }

    compileOptions {
      // Flag to enable support for the new language APIs
      coreLibraryDesugaringEnabled true
    }
  ...
}

dependencies {
  ...
    coreLibraryDesugaring 'com.android.tools:desugar_jdk_libs:2.1.3'
  ...
}
```

#### Tickets SDK status bar colour

The SDK's internal theme defaults the Tickets SDK status bar colour to Ticketmaster blue. To override it, add a `tickets_tm_brand_blue` entry to `android/app/src/main/res/values/colors.xml`:

```xml
<resources>
    <color name="tickets_tm_brand_blue">#YOUR_HEX_COLOR</color>
</resources>
```

</details>

<details open>
<summary><h2 style="display:inline-block">Setting up Expo</h2></summary>

If you are using an Expo (Continuous Native Generation) workflow, ignore the "Setting up iOS" and "Setting up Android" sections above — the native `ios/` and `android/` directories are regenerated by `expo prebuild`, so everything must be configured through a config plugin instead. See [`docs/expo.md`](./docs/expo.md) for a complete example plugin covering the **Kotlin version pin** (required for Ticketmaster SDK `3.18.0`+), `dataBinding`/desugaring, `compileSdk`/`minSdk`, the **login redirect scheme**, and the iOS deployment target.

</details>

<details open>
<summary><h2 style="display:inline-block">Usage</h2></summary>

The full User Guide with all methods can be found [here](./docs/user-guide.md)

#### IgniteProvider

`react-native-ticketmaster-ignite` exports the following modules:

- `IgniteProvider`
- `AccountsSdk`
- `TicketsSdkModal` (iOS only)
- `TicketsSdkEmbedded`
- `RetailSdk`
- `useIgnite`

#### IgniteProvider

This is the only module that must be implemented for the library to work correctly. The purpose of `IgniteProvider` is to pass the config `options` to the native code.

In order to use it, wrap your application with the `IgniteProvider` and pass the API key and client name as a prop:

```typescript
import { IgniteProvider } from 'react-native-ticketmaster-ignite';

<IgniteProvider
  options={{
    apiKey: API_KEY,
    clientName: CLIENT_NAME,
    primaryColor: PRIMARY_COLOR
  }}
>
    <App />
</IgniteProvider>
```

##### The `region` property

The `region` property determines the server deployment region the SDK's will connect to. The values can be either `US` or `UK`. The default value is `US` and should be used unless you have specifically been told to set your region to `UK`.

Generally places within the United States, Canada, Australia, and New Zealand should set the server region to `US` and places/countries within the UK, Ireland, Europe, Middle East and South Africa need to set the server region to `UK`.

See the full User Guide [here](./docs/user-guide.md)

</details>

<details open>
<summary><h2 style="display:inline-block">Running the demo apps</h2></summary>

To run the React Native example app:

Clone the project and then

```bash
cd react-native-ticketmaster-ignite
yarn
cd example/ios
pod install
yarn start
```
Then run the project with either `yarn android`/`yarn ios` or building the app in Android Studio/Xcode.

To run the Expo app: 
Clone the project and then

```bash
cd react-native-ticketmaster-ignite
yarn
cd expo
```
Then run the project with either `yarn expo:android`/`yarn expo:ios`


</details>

<details open>
<summary><h2 style="display:inline-block">Environment variables</h2></summary>

In order to use the library, setup a developer account with Ticketmaster by contacting nexus_sdk@ticketmaster.com.

For the Retail SDK (PrePurchase and Purchase) views, you will need to be provided with your own attraction or venue ID's for events and venue, representatives from nexus_sdk@ticketmaster.com should be able to help with this. For the purpose of initial testing you can use the below.


Replace "someApiKey" with the API keys from your Ticketmaster Developer Account. (iOS and Android need different API keys, see the example at the end of this section)
Replace "clientName" with your company name, for example "My Company Name". You can set this in the `options` prop of `<IgniteProvider>`.
Replace "#026cdf" with the main color theme of your app.


If running in the `example` app you can create a `.env` in `/example` with the values below or update the codebase with your desired values.

```bash
API_KEY=someApiKey
CLIENT_NAME=clientName
PRIMARY_COLOR=#000000
DEMO_EVENT_ID=0C00630DE7294188
DEMO_ATTRACTION_ID=2873404
DEMO_VENUE_ID=KovZpZAEdntA
```

If running the `expo` app then inside `/expo` you can create a `.env` and add:
```bash
EXPO_PUBLIC_API_KEY=someApiKey
EXPO_PUBLIC_CLIENT_NAME=clientName
EXPO_PUBLIC_PRIMARY_COLOR=000000
EXPO_PUBLIC_DEMO_EVENT_ID=0C00630DE7294188
EXPO_PUBLIC_DEMO_ATTRACTION_ID=2873404
EXPO_PUBLIC_DEMO_VENUE_ID=KovZpZAEdntA
```

You need to use a different key for iOS and Android, you can make the value for API_KEY and object `API_KEY={KeyName_ios: abcde, KeyName_android: abcdefg}` and in your RN code you can use `Platform.OS` to select the right KeyName to pass to the SDK. Example:


Library choice for environment variables is optional

```typescript
import Config from 'react-native-config'

const apiKeyJson = JSON.parse(Config.API_KEY)

<IgniteProvider
  options={{
   apiKey:
    apiKeyJson[`KeyName_${Platform.OS}`] || '',
...
```

Note: If you change the API key in an .env for iOS you may need to **Product** > **Clean Build Folder** for the change to take affect.
