## Analytics

## Accounts SDK (iOS only)

| Name | Value |
| ----- | ---- | -----   |
| accountsSdkServiceConfigurationStarted | accountsSdkServiceConfigurationStarted |
| accountsSdkServiceConfigured | accountsSdkServiceConfigured |
| accountsSdkServiceConfiguredCompleted | accountsSdkServiceConfiguredCompleted |
| accountsSdkLoginStarted | accountsSdkLoginStarted |
| accountsSdkLoginPresented | accountsSdkLoginPresented |
| accountsSdkLoggedIn | accountsSdkLoggedIn |
| accountsSdkLoginAborted | accountsSdkLoginAborted |
| accountsSdkLoginFailed | accountsSdkLoginFailed |
| accountsSdkLoginAccountPresented | accountsSdkLoginAccountPresented |
| accountsSdkLoginAccountCompleted | accountsSdkLoginAccountCompleted |
| accountsSdkTokenRefreshed | accountsSdkTokenRefreshed |
| accountsSdkLogoutStarted | accountsSdkLogoutStarted |
| accountsSdkLoggedOut | accountsSdkLoggedOut |
| accountsSdkLogoutCompleted | accountsSdkLogoutCompleted |
| accountsSdkLoginExchanging | accountsSdkLoginExchanging |

More information about the flow of these state change analytics can be found here (https://ignite.ticketmaster.com/v1/docs/analytics-ios)


## Retail SDK (iOS only)

### Purchase SDK

| Name | Description | Values |
| ----- | ---- | -----   |
| purchaseSdkDidBeginTicketSelectionFor | event<br/> date<br/> timeZone | The ticket selection portion of the purchase process begun |
| purchaseSdkDidEndTicketSelectionFor | event<br/> date<br/> timeZone<br/> reason | The ticket selection portion of the purchase process ended | 
| purchaseSdkDidBeginCheckoutFor | event<br/> date<br/> timeZone | The ticket checkout portion of the purchase process begun |
| purchaseSdkDidEndCheckoutFor | event<br/> date<br/> timeZone<br/> reason | The ticket checkout portion of the purchase process ended |
| purchaseSdkDidMakePurchaseFor | event<br/> date<br/> timeZone<br/> orderId<br/> orderName | The user made a purchase and is currently viewing the Order Confirmation page |
| purchaseSdkDidPressNavBarButtonFor | event<br/> button | The user pressed a button on the navigation header bar |
| purchaseSdkDidShare | event<br/> activityType  | The user shared a link to this event |
| purchaseSdkDidViewSubPageFor | event<br/> subPage | The user navigated to a sub-page with the EDP or Cart |
| purchaseSdkDidMakeDecisionFor | event<br/>  date<br/>  timeZone<br/> decision | The user navigated to a sub-page with the EDP or Cart |

### Retail SDK Value Descriptions

| Name | Description |
| ----- | ---- |
| event |  Event name |
| date |  Start date |
| timeZone |  Time zone of the event |
| reason |  The reason the analytic being triggered |
| orderId |  The order identifier |
| orderId |  The name of the order |
| subPage |  The subpage that has been viewed |
| decision |  The decision of the user to trigger the analytic |