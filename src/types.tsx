type BeginData = {
  eventId: string;
  legacyId: string;
  eventName: string;
  date: string;
  timeZone: string;
};

type EndData = {
  eventId: string;
  legacyId: string;
  eventName: string;
  date: string;
  timeZone: string;
  reason: string;
};

type MakePurchaseData = {
  eventId: string;
  legacyId: string;
  eventName: string;
  date: string;
  timeZone: string;
  orderId: string;
  orderName: string;
};

type PressNavBarData = {
  eventId: string;
  legacyId: string;
  eventName: string;
  button: string;
};

type ShareData = {
  eventId: string;
  legacyId: string;
  eventName: string;
  activityType: string;
};

type SubPageData = {
  eventId: string;
  legacyId: string;
  eventName: string;
  subPage: string;
};

type MakeDecisionData = {
  eventId: string;
  legacyId: string;
  eventName: string;
  date: string;
  timeZone: string;
  decision: string;
};

type TicketsSdkVenueConcessionsData = {
  eventOrderInfo: string;
};

export type IgniteAnalytics = {
  accountsSdkServiceConfigurationStarted: 'accountsSdkServiceConfigurationStarted';
  accountsSdkServiceConfigured: 'accountsSdkServiceConfigured';
  accountsSdkServiceConfiguredCompleted: 'accountsSdkServiceConfiguredCompleted';
  accountsSdkLoginStarted: 'accountsSdkLoginStarted';
  accountsSdkLoggedIn: 'accountsSdkLoggedIn';
  accountsSdkLoginAborted: 'accountsSdkLoginAborted';
  accountsSdkLoginFailed: 'accountsSdkLoginFailed';
  accountsSdkLoginAccountPresented: 'accountsSdkLoginAccountPresented';
  accountsSdkLoginAccountCompleted: 'accountsSdkLoginAccountCompleted';
  accountsSdkTokenRefreshed: 'accountsSdkTokenRefreshed';
  accountsSdkLogoutStarted: 'accountsSdkLogoutStarted';
  accountsSdkLoggedOut: 'accountsSdkLoggedOut';
  accountsSdkLogoutCompleted: 'accountsSdkLogoutCompleted';
  accountsSdkLoginExchanging: 'accountsSdkLoginExchanging';
  /**
   * The ticket selection portion of the purchase process begun
   */
  purchaseSdkDidBeginTicketSelectionFor: BeginData;
  purchaseSdkDidEndTicketSelectionFor: EndData;
  purchaseSdkDidBeginCheckoutFor: BeginData;
  purchaseSdkDidEndCheckoutFor: EndData;
  purchaseSdkDidMakePurchaseFor: MakePurchaseData;
  purchaseSdkDidPressNavBarButtonFor: PressNavBarData;
  purchaseSdkDidShare: ShareData;
  purchaseSdkDidViewSubPageFor: SubPageData;
  purchaseSdkDidMakeDecisionFor: MakeDecisionData;
  purchaseSdkManageMyTickets: 'purchaseSdkManageMyTickets';
  ticketsSdkDidViewEvents: 'ticketsSdkDidViewEvents';
  ticketsSdkVenueConcessionsOrderFor: TicketsSdkVenueConcessionsData;
  ticketsSdkVenueConcessionsWalletFor: TicketsSdkVenueConcessionsData;
};

export enum IgniteAnalyticName {
  ACCOUNTS_SDK_SERVICE_CONFIGURATION_STARTED = 'accountsSdkServiceConfigurationStarted',
  ACCOUNTS_SDK_SERVICE_CONFIGURED = 'accountsSdkServiceConfigured',
  ACCOUNTS_SDK_SERVICE_CONFIGURED_COMPLETED = 'accountsSdkServiceConfiguredCompleted',
  ACCOUNTS_SDK_LOGIN_STARTED = 'accountsSdkLoginStarted',
  ACCOUNTS_SDK_LOGGED_IN = 'accountsSdkLoggedIn',
  ACCOUNTS_SDK_LOGIN_ABORTED = 'accountsSdkLoginAborted',
  ACCOUNTS_SDK_LOGIN_FAILED = 'accountsSdkLoginFailed',
  ACCOUNTS_SDK_LOGIN_ACCOUNT_PRESENTED = 'accountsSdkLoginAccountPresented',
  ACCOUNTS_SDK_LOGIN_ACCOUNT_COMPLETED = 'accountsSdkLoginAccountCompleted',
  ACCOUNTS_SDK_TOKEN_REFRESHED = 'accountsSdkTokenRefreshed',
  ACCOUNTS_SDK_LOGOUT_STARTED = 'accountsSdkLogoutStarted',
  ACCOUNTS_SDK_LOGGED_OUT = 'accountsSdkLoggedOut',
  ACCOUNTS_SDK_LOGOUT_COMPLETED = 'accountsSdkLogoutCompleted',
  ACCOUNTS_SDK_LOGIN_EXCHANGING = 'accountsSdkLoginExchanging',
  PURCHASE_SDK_DID_BEGIN_TICKET_SELECTION_FOR = 'purchaseSdkDidBeginTicketSelectionFor',
  PURCHASE_SDK_DID_END_TICKET_SELECTION_FOR = 'purchaseSdkDidEndTicketSelectionFor',
  PURCHASE_SDK_DID_BEGIN_CHECKOUT_FOR = 'purchaseSdkDidBeginCheckoutFor',
  PURCHASE_SDK_DID_END_CHECKOUT_FOR = 'purchaseSdkDidEndCheckoutFor',
  PURCHASE_SDK_DID_MAKE_PURCHASE_FOR = 'purchaseSdkDidMakePurchaseFor',
  PURCHASE_SDK_DID_PRESS_NAV_BAR_BUTTON_FOR = 'purchaseSdkDidPressNavBarButtonFor',
  PURCHASE_SDK_DID_SHARE = 'purchaseSdkDidShare',
  PURCHASE_SDK_DID_VIEW_SUB_PAGE_FOR = 'purchaseSdkDidViewSubPageFor',
  PURCHASE_SDK_DID_MAKE_DECISION_FOR = 'purchaseSdkDidMakeDecisionFor',
  PURCHASE_SDK_MANAGE_MY_TICKETS = 'purchaseSdkManageMyTickets',
  TICKETS_SDK_DID_VIEW_EVENTS = 'ticketsSdkDidViewEvents',
  TICKETS_SDK_VENUE_CONCESSIONS_ORDER_FOR = 'ticketsSdkVenueConcessionsOrderFor',
  TICKETS_SDK_VENUE_CONCESSIONS_WALLET_FOR = 'ticketsSdkVenueConcessionsWalletFor',
}

export type PrebuiltModules = {
  moreTicketActionsModule?: {
    enabled: boolean;
  };
  venueDirectionsModule?: {
    enabled: boolean;
  };
  seatUpgradesModule?: {
    enabled: boolean;
    label?: string;
  };
  venueConcessionsModule?: {
    enabled: boolean;
    orderButtonCallback: (
      data: TicketsSdkVenueConcessionsData
    ) => void | Promise<void>;
    walletButtonCallback: (
      data: TicketsSdkVenueConcessionsData
    ) => void | Promise<void>;
  };
  invoiceModule?: {
    enabled: boolean;
  };
};
