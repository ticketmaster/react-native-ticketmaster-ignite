# Migration guide for version 4.0.0

## Token and MemberInfo object shape update

Before iOS and Android object return data had different shapes

Android
`memberInfo.archticsMember.firstName`
`token.archticsAccessToken`

iOS
`memberInfo.firstName`
`token.accessToken`

But now the below is the required/correct way for both platforms:
`memberInfo.firstName`
`token.accessToken`

You can console log any of the variables to see the all of the available properties

## Tickets SDk Embedded

In Android, the Tickets SDK Embedded component should now correctly position itself under React Navigation headers when the new architecture is turned on in your React Native app.
If it does not offsetTop can still be used but is now used like this:

```typescript
const [offSetTop, setOffSetTop] = useState(0);

useEffect(() => {
  setOffSetTop(100);
}, []);

return (
    <TicketsSdkEmbedded style={{width: '100%', height: '95%'}} offsetTop={offSetTop} />
  );
```

Once it is confirmed there are no issues with the positioning with the TicketsSdkEmbedded component in new architecture RN apps we will eventually deprecate this prop

## Tickets SDK Modal (iOS only)

The iOS Tickets full screen modal is now a function call like Retail SDK, which removes the need of creating `useState` variables.

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

AccountsSDK -> AccountsSdk
RetailSDK -> RetailSdk

```typescript
import { AccountsSdk, RetailSdk } from 'react-native-ticketmaster-ignite';
```

It is advisable you use auth methods from useIgnite hook instead of the AccountsSdk module directly for automatic state updates and simple use within dep arrays.

## eventHeaderType

The info icon in the Purchase navigation header for Android is no longer configurable. `EVENT_INFO` and `EVENT_INFO_SHARE` will not affect it and the button shows up within the WebView of the EDP page itself on the suitable pages.
