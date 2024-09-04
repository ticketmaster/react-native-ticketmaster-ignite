# react-native-ticketmaster-ignite

This library serves as a wrapper for the 3 Ticketmaster Ignite SDK's: [Accounts](https://ignite.ticketmaster.com/docs/accounts-sdk-overview), [Retail](https://ignite.ticketmaster.com/docs/retail-sdk-overview) and [Tickets](https://ignite.ticketmaster.com/docs/tickets-sdk-overview).

In order to use it, setup a developer account with Ticketmaster [here](https://developer.ticketmaster.com/). Once you have it you'll get an **API key** and **scheme** that you'll need to use to finish the setup (see the setting variables paragraph below).

## Installation

```bash
npm install --save react-native-ticketmaster-ignite
```

##### --- or ---

```bash
yarn add react-native-ticketmaster-ignite
```

## Setting up ios

Edit the `Podfile` and set the platform to `15.0`

```
platform :ios, '15.0'
```

- `cd` into the `ios` directory and run `pod install`

## Setting up Android

#### TM scheme

In your project go to `android/app/src/main/res/values/strings.xml` and add this snippet:

```xml
<string name="app_tm_modern_accounts_scheme">samplescheme</string>
```

Replace `samplescheme` with your scheme - you can find it in your Ticketmaster app settings.

#### allowBackup in AndroidManifest

Open the `AndroidManifest.xml` file and:

- make sure that the `manifest` contains `xmlns:tools="http://schemas.android.com/tools"`
- add `tools:replace="android:allowBackup` to the `application`

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

#### Set dataBinding to true

In `android/app/build.gradle` add:

```groovy
android {
  ...
    buildFeatures {
        dataBinding = true
    }
  ...
}
```

#### Set the minSdkVersion

In `android/build.gradle` set the `minSdkVersion` to `26`.

#### add `jcenter()` to build.gradle

Open `android/build.gradle` and add `jcenter()` to `repositories` in `allprojects` if it's not there yet:

```groovy
buildscript {
    ext {
      ...
    }
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
      ...
    }

    allprojects {   // <----- add this
        repositories {   // <-----
            jcenter()   // <-----
        }   // <-----
    }   // <-----
}
```

We are aware of the end-of-life of jcenter, however one of our library's native dependencies is still relying on a tool hosted on `jcenter` . Until it changes, it must be listed in `build.gradle`.

## Usage

`react-native-ticketmaster-ignite` exports the following modules:

- `IgniteProvider`
- `AccountsSDK`
- `TicketsSdkModal` (iOS only)
- `TicketsSdkEmbedded`
- `RetailSDK`
- `useIgnite`

#### IgniteProvider

This is the only module that must be implemented for the library to work correctly. The purpose of `TicketmasterProvider` is to pass the config `options` to the native code.

Props accepted are:

- `apiKey`
- `clientName`
- `primaryColor`

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

`autoUpdate` is a prop that can be set to false to prevent `IgniteProvider` from rerendering your app on app launch. (⚠️ warning: if set to `false`, `authState`'s `isLoggedIn`, `memberInfo` and `isConfigured` will not automatically update and you will have to call `getMemberInfo` and `getIsLoggedIn` manually after app restarts. The default value is `true`. See more on `authState` later on.)

```typescript
import { IgniteProvider } from 'react-native-ticketmaster-ignite';

<IgniteProvider
  options={{
    apiKey: API_KEY,
    clientName: CLIENT_NAME,
    primaryColor: PRIMARY_COLOR
  }}
  autoUpdate={false}
>
    <App />
</IgniteProvider>
```

#### AccountsSDK

Exposes the following functions:

- `configureAccountsSDK` - Configured in `IgniteProvider` before `<App />` is mounted, generally no need to implement this method manually.
- `login`
- `logout`
- `refreshToken`
- `getMemberInfo`
- `getToken`
- `isLoggedIn`

#### useIgnite

To handle authentication in a React Native app you can either use the Accounts SDK module mentioned above directly or you can use the `useIgnite` hook.

The `useIgnite` hook implements all of the native Accounts SDK methods for easy out of the box use in a React Native apps. It also provides `isLoggingIn` and an `authState` object that with properties `isLoggedIn`, `memberInfo` and `isConfigured`, these properties update themselves during and after authenticaion.

Once the user authenticates `isLoggedIn` will remain true after app restarts

`isConfigured` becomes true after the SDK has successfully configured and the local storage `isLoggedIn` value and `memberInfo` response data have both been retrieved from by the SDK. This makes it useful to condition for any splash screen, loading spinners or animations during app launch.

Example:

```tsx
import { ActivityIndicator, Text } from 'react-native';
import { useIgnite } from 'react-native-ticketmaster-ignite';

const {
  login,
  logout,
  getToken,
  refreshToken,
  getMemberInfo,
  getIsLoggedIn,
  isConfigured,
  isLoggingIn,
  authState: { isLoggedIn },
} = useIgnite();

try {
  await login();
} catch (e) {
  console.log('Accounts SDK login error:', (e as Error).message);
}

{
  !!isLoggingIn && (
    <View style={styles.activityIndicator}>
      <ActivityIndicator color={'blue'} size={'small'} />
    </View>
  );
}

{isLoggedIn && <Text>You are logged in<Text/>}
```

The `login()` method from the `useIgnite` hook accepts an object with properties `onLogin` and `skipUpdate`:

- `onLogin` - a callback that fires after successful authentication
- `skipUpdate` - Set value to `true` to prevent a rerender after successful authentication (⚠️ warning: if set to `true`, `isLoggedIn`, `isLoggingIn` and `memberInfo` will not automatically update and you will have to call `getMemberInfo` and `getIsLoggedIn` manually. It's recommended you implement AccountsSDK directly and not use this hook if you want complete control of React Native screen and state updates. The default value is `false`.)

Example:

```tsx
import { ActivityIndicator } from 'react-native';
import { useIgnite } from 'react-native-ticketmaster-ignite';

const { login } = useIgnite();

const callback = () => {
  console.log('User logged in');
};

try {
  // If skipUpdate is not provided its default value is false
  await login({ onLogin: callback, skipUpdate: false });
} catch (e) {
  console.log('Accounts SDK login error:', (e as Error).message);
}
```

`logout()` accepts a similar object here are the shapes below:

```typescript
type LoginParams = {
  onLogin?: () => void;
  skipUpdate?: boolean;
};

type LogoutParams = {
  onLogout?: () => void;
  skipUpdate?: boolean;
};
```

You can see the results of `getToken()`, `getMemberInfo()` and `getIsLoggedIn()` in the console when running the example app.

#### TicketsSdkModal (iOS only)

Example:

```typescript
import { Pressable, Text } from 'react-native';
import { TicketsSdkModal } from 'react-native-ticketmaster-ignite';

const [showTicketsSdk, setShowTicketsSdk] = useState(false);

const onShowTicketsSDK = () => {
  setShowTicketsSdk(true);
};

return (
  <>
    <Pressable
      onPress={() => onShowTicketsSDK()}
    >
      <Text>Show Tickets SDK Modal</Text>
    </Pressable>
    <TicketsSdkModal
      showTicketsModal={showTicketsSdk}
      setShowTicketsModal={setShowTicketsSdk}
    />
  </>
);

```

#### TicketsSdkEmbedded

```typescript

import { TicketsSdkEmbedded } from 'react-native-ticketmaster-ignite';

return <TicketsSdkEmbedded style={{ flex: 1 }} />;
```

React Navigation note: Initially, the altered RN Bottom Tabs View frame height is not available to Native code on iOS, if you notice the embedded SDK view is not fitting inside your RN view with Bottom Tabs on the first render, try adding a 500ms delay to the SDK view:

```typescript

import { TicketsSdkEmbedded } from 'react-native-ticketmaster-ignite';

return <TicketsSdkEmbedded style={{ height: '100%' }} renderTimeDelay={500}/>;
```
⚠️  Please note that `style` and `renderTimeDelay` are props only used on ios.
The Android implementation is always as simple as this:

```typescript

import { TicketsSdkEmbedded } from 'react-native-ticketmaster-ignite';

return <TicketsSdkEmbedded />;
```

#### SecureEntryView (Android only)

Example:

```typescript

import { SecureEntryAndroid } from 'react-native-ticketmaster-ignite';

<View>
  <SecureEntryAndroid token="token_here" />
</View>
```

#### RetailSDK

Module responsible for the purchase and prepurchase flows in the Retail SDK.

###### Events Purchase

Purchase flow (also known as Events Details Page or EDP - see more [here](https://ignite.ticketmaster.com/v1/docs/events-detail-page-edp)) should be used for buying single events by their IDs.

Example:

```typescript
import { RetailSDK } from 'react-native-ticketmaster-ignite';

const onShowPurchase = async () => {
  try {
    await RetailSDK.presentPurchase(DEMO_EVENT_ID);
  } catch (e) {
    console.log((e as Error).message);
  }
};
```

###### Venue PrePurchase

The venue prepurchase flow (also known as Venue Details Page or VDP - see more [here](https://ignite.ticketmaster.com/v1/docs/venue-detail-page-vdp)) should be used for showing events for a particular venue. From there, the user will be able to progress with a selected event into the purchase flow.

Example:

```typescript
import { RetailSDK } from 'react-native-ticketmaster-ignite';

const onShowPrePurchaseVenue = async () => {
  try {
    await RetailSDK.presentPrePurchaseVenue(DEMO_VENUE_ID);
  } catch (e) {
    console.log((e as Error).message);
  }
};
```

###### Attraction PrePurchase

The attraction prepurchase flow (also known as Attraction Details Page or VDP - see more [here](https://ignite.ticketmaster.com/docs/attraction-detail-page-adp)) should be used for showing events for a particular attraction, eg. a sports team or musicial. From there, the user will be able to progress with a selected event into the purchase flow.

Example:

```typescript
import { RetailSDK } from 'react-native-ticketmaster-ignite';

const onShowPrePurchaseAttraction = async () => {
  try {
    await RetailSDK.presentPrePurchaseAttraction(DEMO_ATTRACTION_ID);
  } catch (e) {
    console.log((e as Error).message);
  }
};
```

## Environment variables

You will need an API key for this app to run, you can get one here [Developer Account](https://developer-acct.ticketmaster.com/user/login).

For the Retail SDK (PrePurchase and Purchase) views, you will need ID's which you can get that from the [Discovery API](https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/). For the purpose of initial testing you can use the below.

Replace "someApiKey" with the API key from your Ticketmaster Developer Account.
Replace "clientName" with your company name, for example "My Company Name". You can set this in the `options` prop of `<IgniteProvider>`.
Replace "#026cdf" with the main color theme of your app.

```bash
API_KEY=someApiKey
CLIENT_NAME=clientName
PRIMARY_COLOR=#026cdf
DEMO_EVENT_ID=1100607693B119D8
DEMO_ATTRACTION_ID=2873404
DEMO_VENUE_ID=KovZpZAEdntA
```
