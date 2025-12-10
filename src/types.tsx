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

type TicketsSdkEventData = {
  eventOrderInfo: string;
};

export type IgniteAnalytics = {
  accountsSdkServiceConfigurationStarted: 'accountsSdkServiceConfigurationStarted';
  accountsSdkServiceConfigured: 'accountsSdkServiceConfigured';
  accountsSdkServiceConfigurationCompleted: 'accountsSdkServiceConfigurationCompleted';
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
  ticketsSdkVenueConcessionsOrderFor: TicketsSdkEventData;
  ticketsSdkVenueConcessionsWalletFor: TicketsSdkEventData;
  ticketsSdkCustomModuleButton1: TicketsSdkEventData;
  ticketsSdkCustomModuleButton2: TicketsSdkEventData;
  ticketsSdkCustomModuleButton3: TicketsSdkEventData;
};

export enum IgniteAnalyticName {
  ACCOUNTS_SDK_SERVICE_CONFIGURATION_STARTED = 'accountsSdkServiceConfigurationStarted',
  ACCOUNTS_SDK_SERVICE_CONFIGURED = 'accountsSdkServiceConfigured',
  ACCOUNTS_SDK_SERVICE_CONFIGURATION_COMPLETED = 'accountsSdkServiceConfigurationCompleted',
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
  TICKETS_SDK_CUSTOM_MODULE_BUTTON_1 = 'ticketsSdkCustomModuleButton1',
  TICKETS_SDK_CUSTOM_MODULE_BUTTON_2 = 'ticketsSdkCustomModuleButton2',
  TICKETS_SDK_CUSTOM_MODULE_BUTTON_3 = 'ticketsSdkCustomModuleButton3',
}

export type VenueConcessionsModule = {
  image?: any;
  enabled: boolean;
  topLabelText?: string;
  bottomLabelText?: string;
  dismissTicketViewOrderIos?: boolean;
  dismissTicketViewWalletIos?: boolean;
  orderButtonCallback: (data: TicketsSdkEventData) => void | Promise<void>;
  walletButtonCallback: (data: TicketsSdkEventData) => void | Promise<void>;
};

export type PrebuiltModules = {
  moreTicketActionsModule?: {
    enabled: boolean;
  };
  venueDirectionsModule?: {
    enabled: boolean;
  };
  seatUpgradesModule?: {
    enabled: boolean;
    image?: any;
    topLabelText?: string;
    bottomLabelText?: string;
  };
  venueConcessionsModule?: VenueConcessionsModule;
  invoiceModule?: {
    enabled: boolean;
  };
};

export type CustomModules = {
  button1?: {
    enabled: boolean;
    title: string;
    dismissTicketViewIos?: boolean;
    callback: (data: TicketsSdkEventData) => void | Promise<void>;
  };
  button2?: {
    enabled: boolean;
    title: string;
    dismissTicketViewIos?: boolean;
    callback: (data: TicketsSdkEventData) => void | Promise<void>;
  };
  button3?: {
    enabled: boolean;
    title: string;
    dismissTicketViewIos?: boolean;
    callback: (data: TicketsSdkEventData) => void | Promise<void>;
  };
};

export type Region = 'US' | 'UK';

// eslint-disable-next-line prettier/prettier
export type MarketDomain =
  | 'AE'
  | 'AT'
  | 'AU'
  | 'BE'
  | 'CA'
  | 'CH'
  | 'CZ'
  | 'DE'
  | 'DK'
  | 'ES'
  | 'FI'
  | 'IE'
  | 'MX'
  | 'NL'
  | 'NO'
  | 'NZ'
  | 'PL'
  | 'SE'
  | 'UK'
  | 'US'
  | 'ZA';

export type EventHeaderType =
  | 'NO_TOOLBARS'
  | 'EVENT_INFO'
  | 'EVENT_SHARE'
  | 'EVENT_INFO_SHARE';
