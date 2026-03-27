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
const ticketsSdkLogin = useSelector(ticketsSdkLoginSelector)

useEffect(() => {
  if (isLoggedIn) {
    setTimeout(() => dispatch(setTicketsSdkLogin(true)), 500)
  } else {
    dispatch(setTicketsSdkLogin(false))
  }
}, [dispatch, isLoggedIn])

return (
  <>
    {ticketsSdkLogin ? (
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

## Troubleshooting

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



### Building locally (iOS):

If any build issues happen on iOS you can try:

From project root
```bash
cd ios
rm -rf Pods Podfile.lock build
pod install
```

And try rebuilding iOS again


