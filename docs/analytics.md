## Analytics

## Accounts SDK

| Name | Value |
| ----- | ---- |
| accountsSdkServiceConfigurationStarted | accountsSdkServiceConfigurationStarted |
| accountsSdkServiceConfigured | accountsSdkServiceConfigured |
| accountsSdkServiceConfiguredCompleted | accountsSdkServiceConfiguredCompleted |
| accountsSdkLoginStarted | accountsSdkLoginStarted |
| accountsSdkLoginPresented (iOS only) | accountsSdkLoginPresented |
| accountsSdkLoggedIn | accountsSdkLoggedIn |
| accountsSdkLoginAborted | accountsSdkLoginAborted |
| accountsSdkLoginFailed | accountsSdkLoginFailed |
| accountsSdkLoginAccountPresented (iOS only) | accountsSdkLoginAccountPresented |
| accountsSdkLoginAccountCompleted (iOS only) | accountsSdkLoginAccountCompleted |
| accountsSdkTokenRefreshed | accountsSdkTokenRefreshed |
| accountsSdkLogoutStarted | accountsSdkLogoutStarted |
| accountsSdkLoggedOut | accountsSdkLoggedOut |
| accountsSdkLogoutCompleted | accountsSdkLogoutCompleted |
| accountsSdkLoginExchanging (iOS only) | accountsSdkLoginExchanging |

More information about the flow of these state change analytics can be found here https://ignite.ticketmaster.com/v1/docs/analytics-ios


## Retail SDK (iOS only)

### Purchase SDK

| Name | Values | Description |
| ----- | ---- | -----   |
| purchaseSdkDidBeginTicketSelectionFor | eventId<br/> legacyId<br/> eventName<br/> date<br/> timeZone | The ticket selection portion of the purchase process begun |
| purchaseSdkDidEndTicketSelectionFor | eventId<br/> legacyId<br/> eventName<br/> date<br/> timeZone<br/> reason | The ticket selection portion of the purchase process ended | 
| purchaseSdkDidBeginCheckoutFor | eventId<br/> legacyId<br/> eventName<br/> date<br/> timeZone | The ticket checkout portion of the purchase process begun |
| purchaseSdkDidEndCheckoutFor | eventId<br/> legacyId<br/> eventName<br/> date<br/> timeZone<br/> reason | The ticket checkout portion of the purchase process ended |
| purchaseSdkDidMakePurchaseFor | eventId<br/> legacyId<br/> eventName<br/> date<br/> timeZone<br/> orderId<br/> orderName | The user made a purchase and is currently viewing the Order Confirmation page |
| purchaseSdkDidPressNavBarButtonFor | eventId<br/> legacyId<br/> eventName<br/> button | The user pressed a button on the navigation header bar |
| purchaseSdkDidShare | eventId<br/> legacyId<br/> eventName<br/> activityType | The user shared a link to this event |
| purchaseSdkDidViewSubPageFor | eventId<br/> legacyId<br/> eventName<br/> subPage | The user navigated to a sub-page with the EDP or Cart |
| purchaseSdkDidMakeDecisionFor (iOS only) | eventId<br/> legacyId<br/> eventName<br/>  date<br/>  timeZone<br/> decision | The user has interacted with an UI component, resulting in a decision |

### Retail SDK Value Descriptions

| Name | Description |
| ----- | ---- |
| eventId |  The discovery event ID  |
| legacyId |  The legacy event ID  |
| eventName |  The event name |
| date |  The start date of the event |
| timeZone |  Time zone of the event |
| reason |  The reason the analytic was triggered |
| orderId |  The order identifier |
| orderName |  The name of the order |
| subPage |  The subpage that has been viewed |
| decision (iOS only) |  The decision of the user to trigger the analytic |
| activityType (iOS only) |  The activity type the user used to share the event |
