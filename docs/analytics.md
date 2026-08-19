## Analytics

## Accounts SDK

### Authentication State Events

| Name | Value |
| ----- | ---- |
| accountsSdkServiceConfigurationStarted | accountsSdkServiceConfigurationStarted |
| accountsSdkServiceConfigured | accountsSdkServiceConfigured |
| accountsSdkServiceConfigurationCompleted | accountsSdkServiceConfigurationCompleted |
| accountsSdkLoginStarted | accountsSdkLoginStarted |
| accountsSdkLoginPresented | accountsSdkLoginPresented |
| accountsSdkLoggedIn | accountsSdkLoggedIn |
| accountsSdkLoginAborted | accountsSdkLoginAborted |
| accountsSdkLoginFailed | accountsSdkLoginFailed |
| accountsSdkLoginLinkAccountPresented | accountsSdkLoginLinkAccountPresented |
| accountsSdkLoginAccountCompleted | accountsSdkLoginAccountCompleted |
| accountsSdkTokenRefreshed | accountsSdkTokenRefreshed |
| accountsSdkLogoutStarted | accountsSdkLogoutStarted |
| accountsSdkLoggedOut | accountsSdkLoggedOut |
| accountsSdkLogoutCompleted | accountsSdkLogoutCompleted |

### Federated Login Events (Android only)

| Name | Value | Description |
| ----- | ---- | ---- |
| accountsSdkFedLoginLinkAccountsScreenShowed | accountsSdkFedLoginLinkAccountsScreenShowed | The federated login account linking screen was shown |
| accountsSdkFedLoginLinkAccountsScreenDismissed | accountsSdkFedLoginLinkAccountsScreenDismissed | The federated login account linking screen was dismissed |
| accountsSdkFedLoginScreenDismissedAfterSuccessLoginNoLink | accountsSdkFedLoginScreenDismissedAfterSuccessLoginNoLink | Login screen dismissed after successful login without linking accounts |
| accountsSdkFedLoginLinkAccountsButtonPressed | accountsSdkFedLoginLinkAccountsButtonPressed | User pressed the "Link Accounts" button |
| accountsSdkFedLoginNoThanksButtonPressed | accountsSdkFedLoginNoThanksButtonPressed | User pressed the "No Thanks" button to skip account linking |

More information about the flow of these state change analytics can be found here https://ignite.ticketmaster.com/docs/authentication-state


## Retail SDK

### PrePurchase SDK

| Name | Values | Description |
| ----- | ---- | -----   |
| prePurchaseSdkDidFirePageView | pageName<br/> pageUrl<br/> pageReferrer<br/> pageType | The web page reported a UAL page view event in PrePurchase |
| prePurchaseSdkDidShare | pageTitle<br/> pageUrl<br/> activityType | The user shared a page from PrePurchase |
| prePurchaseSdkDidReportUalUserAction (Android only) | actionType<br/> actionLabel<br/> actionValue<br/> actionName<br/> actionCategory | The web page reported a UAL user action event in PrePurchase |
| prePurchaseSdkPageLoadDidErrorFor (Android only) | url<br/> error | An error occurred while loading a page in PrePurchase |
| prePurchaseSdkWebPageDidErrorFor (Android only) | url<br/> error | An error occurred on a webpage in PrePurchase |
| prePurchaseSdkWebPageDidReportLoadingPage (Android only) | url | A page started loading in PrePurchase |
| prePurchaseSdkWebPageDidReportPageLoadComplete (Android only) | url<br/> duration | A page finished loading in PrePurchase |
| prePurchaseSdkWebPageDidReportProgressBarTimeout (Android only) | url<br/> duration | A page load timed out in PrePurchase |
| prePurchaseSdkDidBeginTicketSelectionFor (Android only) | eventId<br/> legacyId<br/> eventName | The user selected an event in PrePurchase |
| prePurchaseSdkDidEncounterUnsupportedUrl (Android only) | url | PrePurchase encountered an unsupported URL |
| prePurchaseSdkDidLoadPage (Android only) | pageType<br/> data<br/> categoryId<br/> categoryName<br/> categoryUrl<br/> cityName<br/> fullCityName | A page finished loading in PrePurchase with category details |

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
| purchaseSdkDidMakeDecisionFor (iOS only) | eventId<br/> legacyId<br/> eventName<br/>  date<br/>  timeZone<br/> decision | The user has interacted with a UI component, resulting in a decision |
| purchaseSdkManageMyTickets (Android only) | purchaseSdkManageMyTickets | The user has pressed Managed My Tickets on the order confirmation screen |

### Web Analytics Events

| Name | Values | Description |
| ----- | ---- | -----   |
| purchaseSdkWebPageDidReportUALPageView | pageName<br/> pageUrl<br/> pageReferrer<br/> pageType | The web page reported a UAL page view event |
| purchaseSdkWebPageDidReportUALCommerceEvent | eventType<br/> eventName<br/> transactionId<br/> transactionTotal | The web page reported a UAL commerce event |
| purchaseSdkWebReportedViewItem (Android only) | itemId<br/> itemName<br/> itemCategory<br/> itemVariant | The web page reported a UAL view item event |
| purchaseSdkWebPageDidReportUALUserAction (Android only) | actionType<br/> actionLabel<br/> actionValue<br/> actionName<br/> actionCategory | The web page reported a UAL user action event |
| purchaseSdkPageLoadDidErrorFor | url<br/> error | An error occurred while loading a web page |
| purchaseSdkWebPageDidErrorFor | url<br/> error | An error occurred on a web page |

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
| pageName |  The name of the web page viewed |
| pageUrl |  The URL of the web page viewed |
| pageReferrer |  The referrer URL of the web page |
| pageType |  The type of the web page |
| eventType |  The type of commerce event |
| transactionId |  The transaction identifier |
| transactionTotal |  The total transaction amount |
| itemId (Android only) |  The item identifier |
| itemName (Android only) |  The item name |
| itemCategory (Android only) |  The item category |
| itemVariant (Android only) |  The item variant |
| actionType (Android only) |  The type of user action |
| actionLabel (Android only) |  The label of the user action |
| actionValue (Android only) |  The value of the user action |
| actionName (Android only) |  The name of the user action |
| actionCategory (Android only) |  The category of the user action |
| url |  The URL where the error occurred |
| error |  The error message or description |

## Tickets SDK

### Page View Events

| Name | Values | Description |
| ----- | ---- | -----   |
| ticketsSdkDidViewEvents | ticketsSdkDidViewEvents | The user has successfully authenticated and been shown their purchased events |
| ticketsSdkDidViewEventTickets | eventId<br/> eventName<br/> ticketCount | The user views tickets for a specific event |
| ticketsSdkDidViewTicketBarcode | eventId<br/> eventName<br/> section<br/> row<br/> seat | The user views the barcode for a specific ticket |
| ticketsSdkDidViewTicketDetails | eventId<br/> eventName<br/> section<br/> row<br/> seat | The user views the details/back of a specific ticket |
| ticketsSdkDidViewMfaForTicketOperation | ticketsSdkDidViewMfaForTicketOperation | Multi-factor authentication prompt shown for a ticket operation |
| ticketsSdkDidViewMfaForViewBarcode | ticketsSdkDidViewMfaForViewBarcode | Multi-factor authentication prompt shown to view barcode |
| ticketsSdkDidViewMfaForWebpage | ticketsSdkDidViewMfaForWebpage | Multi-factor authentication prompt shown for a webpage |
| ticketsSdkDidViewEventModules (iOS only) | eventId<br/> eventName<br/> ticketCount | User scrolled down to view modules on tickets listing page |
| ticketsSdkDidViewTicketDelivery (iOS only) | eventId<br/> eventName<br/> section<br/> row<br/> seat | User viewed ticket delivery method info (non-barcode) |
| ticketsSdkDidViewEventInfoBanner (iOS only) | eventId<br/> eventName | User viewed event info banner (health check, tax info, etc.) |

### User Action Events

| Name | Values | Description |
| ----- | ---- | -----   |
| ticketsSdkDidInitiateAddTicketToWallet | eventId<br/> eventName<br/> section<br/> row<br/> seat | The user initiated adding a ticket to Apple Wallet (iOS) or Google Wallet (Android) |
| ticketsSdkDidFinishAddTicketToWallet (iOS only) | eventId<br/> eventName<br/> ticketCount<br/> tickets (array) | The user successfully finished adding ticket(s) to Apple Wallet |
| ticketsSdkDidCancelAddTicketToWallet (iOS only) | ticketsSdkDidCancelAddTicketToWallet | The user cancelled adding a ticket to Apple Wallet |
| ticketsSdkDidInitiateTransfer | eventId<br/> eventName<br/> ticketCount<br/> faceValue (Android) | The user started the transfer process for ticket(s) |
| ticketsSdkDidCancelTransfer | eventId<br/> eventName<br/> ticketCount (iOS)<br/> transferId (Android)<br/> orderId (Android) | The user cancelled a ticket transfer |
| ticketsSdkDidAcceptTransfer (Android only) | eventId<br/> eventName<br/> transferId | The user accepted a ticket transfer |
| ticketsSdkDidEditResale (iOS only) | eventId<br/> eventName<br/> ticketCount | The user pressed the Edit Resale Posting button |
| ticketsSdkDidCancelResale | eventId<br/> eventName<br/> ticketCount (iOS)<br/> postingId (Android) | The user cancelled a ticket resale listing |
| ticketsSdkDidShareTransfer (Android only) | eventId<br/> eventName | The user shared a ticket transfer |
| ticketsSdkDidTakeBarcodeScreenshot | eventId<br/> eventName<br/> section (iOS)<br/> row (iOS)<br/> seat (iOS) | The user took a screenshot of the ticket barcode |
| ticketsSdkDidPullToRefreshEvents | eventCount (iOS) | The user pulled to refresh the events list |
| ticketsSdkDidPressEventInfoBanner (iOS only) | eventId<br/> eventName | The user pressed More Info on the event info banner |
| ticketsSdkDidPressModuleActionButton (iOS only) | eventId<br/> eventName<br/> moduleId<br/> buttonTitle<br/> buttonCallback | The user pressed a button on a custom module |
| ticketsSdkDidPressNavbarButton (iOS only) | eventId<br/> eventName | The user pressed the NavBar button |

### Module Events

| Name | Values | Description |
| ----- | ---- | -----   |
| ticketsSdkModalDidDismiss | ticketsSdkModalDidDismiss | The Tickets SDK modal has closed |
| ticketsSdkVenueConcessionsOrderFor | eventOrderInfo | The user has pressed the order button on the Venue Concessions module | 
| ticketsSdkVenueConcessionsWalletFor | eventOrderInfo | The user has pressed the wallet button on the Venue Concessions module |
| ticketsSdkCustomModuleButton1 | eventOrderInfo | The user has pressed custom module button 1 |
| ticketsSdkCustomModuleButton2 | eventOrderInfo | The user has pressed custom module button 2 |
| ticketsSdkCustomModuleButton3 | eventOrderInfo | The user has pressed custom module button 3 |

### Tickets SDK Value Descriptions

| Name | Description |
| ----- | ---- |
| eventId |  The event identifier  |
| eventName |  The name of the event  |
| ticketCount |  The number of tickets  |
| section |  The ticket section name  |
| row |  The ticket row name  |
| seat |  The ticket seat name  |
| faceValue (Android only) |  The face value of the ticket(s)  |
| transferId (Android only) |  The transfer identifier  |
| orderId |  The order identifier  |
| postingId |  The resale posting identifier  |
| eventCount |  The number of events  |
| eventOrderInfo |  Information about the event and specific order the user was viewing  |
| tickets (iOS only) |  Array of ticket objects containing section, row, and seat information  |

More information about Tickets SDK analytics can be found here https://ignite.ticketmaster.com/docs/analytics-4
