# Migration guide for version 4.0.0


## Token and MemberInfo object shape update

```typescript
const tokenData = getToken();
const memberInfo = getMemberInfo();
```

Before iOS and Android `token` and `memberInfo` return data had different object shapes

**Old:**

Android
```typescript
tokenData.archticsAccessToken
memberInfo.archticsMember.firstName
```

iOS
```typescript
tokenData.accessToken
memberInfo.firstName
```

**New:**

But now the below is the required/correct way for both platforms:
```typescript
tokenData.accessToken
memberInfo.firstName
```

You can console log any of the objects to see the all of the available properties.


## Tickets SDK Embedded

TicketsSdkEmbedded is now a Fabric component which typically wants a width and height.

As the button navigation bottoms can differ on Android and iOS, `Dimensions` from React Native can be used to calculate a dynamic height for both platforms.

```typescript
const ticketsWindowHeight = Dimensions.get('window').height - 150

 <TicketsSdkEmbedded style={height: ticketsWindowHeight, width: '100%'} />
```

If you do not send a style prop, `{width: '100%', height: '100%'}` is used by default:

```typescript
 <TicketsSdkEmbedded />
```

On Android, the `<TicketsSdkEmbedded />` component should now correctly position itself under React Navigation headers when the new architecture is turned on in your React Native app. If it does not `offsetTop` can still be used but is now used like this:

```typescript
const [offSetTop, setOffSetTop] = useState(0);

useEffect(() => {
  setOffSetTop(100);
}, []);

return (
    <TicketsSdkEmbedded style={{width: '100%', height: '95%'}} offsetTop={offSetTop} />
  );
```

Once it is confirmed there are no issues with the positioning with the `TicketsSdkEmbedded` component in new architecture RN apps we will eventually deprecate this prop.


## Tickets SDK Embedded with a RN custom login screen 

The Tickets SDK has it's own login screen. `isLoggedIn` from `useIgnite()` is the Accounts SDK value and on v4 of this library `isLoggedIn` can become true much quicker than the Tickets SDK default login screen dismisses. If you want to show your own custom login screen above the SDK default screen you will have to handle any delays in this UI transition yourself. You can do this with a loading screen/screen transition or a persisted custom var. Below is an example of a persisted custom var:


```typescript
const {
    authState: {isLoggedIn}
  } = useIgnite()
const isTicketsSdkLoggedIn = useSelector(isTicketsSdkLoggedInSelector)

useEffect(() => {
  if (isLoggedIn) {
    setTimeout(() => dispatch(setIsTicketsSdkLoggedIn(true)), 500)
  } else {
    dispatch(setIsTicketsSdkLoggedIn(false))
  }
}, [dispatch, isLoggedIn])

return (
  <>
    {isTicketsSdkLoggedIn ? (
        <TicketsSdkEmbedded
          style={{height: ticketsWindowHeight, width: '100%'}}
        />
 ...
```
You will need to persist the custom variable using a local storage library/tool of your choice.


## Tickets SDK Modal (iOS only)

The iOS Tickets SDK full screen modal is now a function call like the Retail SDK views, which removes the need of creating `useState` variables.

Example:

```typescript
import { Platform, Pressable, Text } from 'react-native';
import { TicketsSdkModal } from 'react-native-ticketmaster-ignite';

const onShowTicketsSdkModal = () => {
    Platform.OS === 'ios' && TicketsSdkModal?.showTicketsSdkModal();
};

return (
  <>
    {Platform.OS === 'ios' && (
      <Pressable onPress={() => onShowTicketsSdkModal()}>
        <Text>Show Tickets SDK Modal</Text>
      </Pressable>
    )}
  </>
);

```

## Accounts and Retail SDK modules

Accounts and Retail SDK modules have been renamed:

`AccountsSDK` -> `AccountsSdk`

`RetailSDK` -> `RetailSdk`

```typescript
import { AccountsSdk, RetailSdk } from 'react-native-ticketmaster-ignite';
```

It is advisable you use auth methods from the `useIgnite` hook instead of the `AccountsSdk` module directly for automatic auth state updates and simple use in dep arrays.

## eventHeaderType

The info icon in the Purchase SDK navigation header for Android is no longer configurable. `EVENT_INFO` and `EVENT_INFO_SHARE` will not affect it and the button shows up within the WebView of the EDP page itself on the suitable pages.

## Switching teams/venue (API key) during runtime

To switch teams in v4 of this library you can use the `refreshConfiguration()` method.

```tsx
import { useIgnite } from 'react-native-ticketmaster-ignite';

  const {
    login,
    refreshConfiguration,
  } = useIgnite();

try {
  await refreshConfiguration({
    apiKey: 'someApiKey',
    clientName: 'Team 2',
    primaryColor: '#FF0000',
  });
} catch (e) {
  console.log('Account SDK refresh configuration error:', (e as Error).message);
}
```

When switching to a new API key, `refreshConfiguration()` automatically calls `login()` after configuration since users must authenticate at least once per key. Set `skipAutoLogin` to true to prevent this, but a user must be logged in to the new team or issues will arise when using the Tickets SDK. If a user has logged into 2 different teams, they can now freely switch between those 2 teams without needing to login.

To reconfigure the Tickets SDK, an unmount on blur approach needs to be done for both Android and iOS. In React Native's Fabric renderer (New Architecture), iOS views remains in memory and continues rendering even when "hidden" by React Navigation Bottom Tabs. To solve this, the `<TicketsSdkEmbedded />` component has a new prop called `isFocused` which will trigger additional logic within the `<TicketsSdkEmbedded />` component to reconfigure the iOS Tickets SDK. During team reconfiguration and login, unmount the `<TicketsSdkEmbedded />` component by navigating to a custom RN login/loading screen and after login is successful navigate back to the `<TicketsSdkEmbedded />` component.

⚠️ Warning: `isFocused` must toggle from `false` to `true` to trigger the Tickets SDK refresh/reconfiguration. Navigating to another RN screen that is still within the same bottom tab screen does not always toggle `isFocused` from `false` to `true` depending on the navigation approach, so while implementing API key switching you must log the variable and ensure your approach toggles the boolean. Alternatively, you can create your own custom variable and toggle it within your JS method that calls `refreshConfiguration()`.


```typescript
import { useIsFocused } from '@react-navigation/native';

const isFocused = useIsFocused();

return (
  <TicketsSdkEmbedded
    isFocused={isFocused}
  />
);
```

Expo 

```typescript
import { useIsFocused } from 'expo-router';

const isFocused = useIsFocused();

return (
  <TicketsSdkEmbedded
    isFocused={isFocused}
  />
);
```

Currently in this library Android does not have a default login screen, so always make sure the new API key is configured and the user is logged in before you show the `<TicketsSdkEmbedded />` component.

For React Native iOS, there is currently no way to know if the user has not done the initial login for a new team, the Accounts SDK auto logs in the new team so it returns the new token and memberInfo data but the Tickets SDK will show a signed out screen if the user has not done the initial login. For iOS it would be better to not skip login with `skipAutoLogin`. If they have done the initial login for a new team, the login modals will not popup again so the user will not be disturbed. 

For Android, `getIsLoggedIn()` and `isLoggedIn` will return `false` if a user switches to a team they haven't done the inital login for, meaning the smoothest `refreshConfiguration()` experince for both platforms results in:

```tsx
import { useIgnite } from 'react-native-ticketmaster-ignite';

  const {
    login,
    getIsLoggedIn,
    refreshConfiguration,
  } = useIgnite();

try {
  await refreshConfiguration({
    apiKey: 'someApiKey',
    clientName: 'Team 2',
    primaryColor: '#FF0000',
    skipAutoLogin: Platform.OS === 'android',
  });
  if (Platform.OS === 'android' && !getIsLoggedIn()) {
    login()
  }
} catch (e) {
  console.log('Account SDK refresh configuration error:', (e as Error).message);
}
```

## Ticket Deep Links

`setTicketDeepLink()` is now deprecated and `<TicketsSdkEmbedded />` now receives a prop for deep links.

```typescript
import { useIsFocused } from '@react-navigation/native';

const isFocused = useIsFocused();
// Set the deeplink value in an earlier screen or with redux/context before navigating to the screen rendering the Tickets SDK.
const [ticketDeepLinkId, setTicketDeepLinkId] = useState('');
const setTicketDeepLink = () => setTicketDeepLinkId('TICKET_ORDER_OR_EVENT_ID');
  
  return <TicketsSdkEmbedded deepLinkId={isFocused ? ticketDeepLinkId : ''} />;
```

`isFocused` is needed because if you are using Bottom Tabs from React Navigation it will render the Tickets Tab after app launch as soon as a user lands on the Home Tab, so if they are already logged in the Tickets SDK would trigger their ticket to popup in a modal, unless you have unmount on blur logic in the RN screen of the Tickets Tab.

If you want to do multiple deep links to the `<TicketsSdkEmbedded />` component within an app session without the user closing the app, you will need to do an unmount on blur approach. The `<TicketsSdkEmbedded />` component receives an `isFocused` prop. You will have to send the component React Navigation's `isFocused` value or a custom screen focus boolean as in React Native's Fabric renderer (New Architecture), iOS views remains in memory and continues rendering even when "hidden" by React Navigation, so we have extra logic inside the `<TicketsSdkEmbedded />` component to remount the iOS Tickets SDK to handle subsequent deep links within an apps session after the initial deep link.

```typescript
import { useIsFocused } from '@react-navigation/native';

const isFocused = useIsFocused();
const [ticketDeepLinkId, setTicketDeepLinkId] = useState('');
const setTicketDeepLink = () => setTicketDeepLinkId('TICKET_ORDER_OR_EVENT_ID');

  useFocusEffect(
    useCallback(() => {
      return () => {
        setTicketDeepLinkId('');
      };
    }, [setTicketDeepLinkId])
  );

  return (
    <TicketsSdkEmbedded
      deepLinkId={isFocused ? ticketDeepLinkId : ''}
      isFocused={isFocused}
    />
  );
```

The useFocusEffect unmount logic is to clear the deep link ID otherwise the users ticket will pop up after each remount of the `<TicketsSdkEmbedded />` component.

## Troubleshooting

### Building locally (iOS):

If any build issues happen on iOS you can try:

From project root
```bash
cd ios
rm -rf Pods Podfile.lock build
pod install
```

If that fails try
```bash
cd ios
rm -rf Pods Podfile.lock build
rm -rf ~/Library/Developer/Xcode/DerivedData/TicketmasterIgniteExample-*
pod install
```

And try rebuilding iOS again

### Building locally (Android):
For Android it is adviseable `newArchEnabled=true` is in android/gradle.properties

If more build issues happen on Android you can try

From project root:
```bash
cd android && ./gradlew clean && cd ..
```

Clear all caches:
```bash
rm -rf android/.gradle
rm -rf android/app/build
rm -rf android/build
rm -rf node_modules/react-native-ticketmaster-ignite/android/.gradle
rm -rf node_modules/react-native-ticketmaster-ignite/android/build
```

Regenerate codegen:
```bash
npx react-native codegen
```

Rebuild:
```bash
cd android && ./gradlew generateCodegenArtifactsFromSchema && cd ..
```
```
rm -rf node_modules
yarn install
```

Then in Android Studio:
File → Invalidate Caches → Invalidate and Restart
After restart: Build → Rebuild Project
