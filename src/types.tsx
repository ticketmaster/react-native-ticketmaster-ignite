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

type TicketsSdkEventTicketsData = {
  eventId: string;
  eventName: string;
  ticketCount: number;
};

type TicketsSdkTicketData = {
  eventId: string;
  eventName: string;
  section: string;
  row: string;
  seat: string;
};

type TicketsSdkTransferData = {
  eventId: string;
  eventName: string;
  ticketCount: number;
  faceValue: string;
};

type TicketsSdkCancelTransferData = {
  eventId: string;
  eventName: string;
  transferId: string;
  orderId: string;
};

type TicketsSdkCancelResaleData = {
  eventId: string;
  eventName: string;
  postingId: string;
};

type TicketsSdkRefreshData = {
  eventCount: number;
};

type UalPageViewData = {
  pageName: string;
  pageUrl: string;
  pageReferrer?: string;
  pageType: string;
};

type UalCommerceEventData = {
  eventType: string;
  eventName: string;
  transactionId: string;
  transactionTotal: string;
};

type UalViewItemData = {
  itemId: string;
  itemName: string;
  itemCategory: string;
  itemVariant: string;
};

type UalUserActionData = {
  actionType: string;
  actionLabel: string;
  actionValue: string;
  actionName: string;
  actionCategory: string;
};

type WebErrorData = {
  url: string;
  error: string;
};

type PrePurchaseShareData = {
  pageTitle: string;
  pageUrl: string;
  activityType: string;
};

type PrePurchasePageLoadData = {
  url: string;
  duration: number;
};

type PrePurchasePageStartData = {
  url: string;
};

type PrePurchaseEventSelectionData = {
  eventId: string;
  legacyId: string;
  eventName: string;
};

type PrePurchaseUnsupportedUrlData = {
  url: string;
};

type PrePurchasePageLoadedData = {
  pageType: string;
  data: string;
  categoryId?: string;
  categoryName?: string;
  categoryUrl?: string;
  cityName?: string;
  fullCityName?: string;
};

export type IgniteAnalytics = {
  accountsSdkServiceConfigurationStarted: 'accountsSdkServiceConfigurationStarted';
  accountsSdkServiceConfigured: 'accountsSdkServiceConfigured';
  accountsSdkServiceConfigurationCompleted: 'accountsSdkServiceConfigurationCompleted';
  accountsSdkLoginStarted: 'accountsSdkLoginStarted';
  accountsSdkLoginPresented: 'accountsSdkLoginPresented';
  accountsSdkLoggedIn: 'accountsSdkLoggedIn';
  accountsSdkLoginAborted: 'accountsSdkLoginAborted';
  accountsSdkLoginFailed: 'accountsSdkLoginFailed';
  accountsSdkLoginLinkAccountPresented: 'accountsSdkLoginLinkAccountPresented';
  accountsSdkLoginAccountPresented: 'accountsSdkLoginAccountPresented';
  accountsSdkLoginAccountCompleted: 'accountsSdkLoginAccountCompleted';
  accountsSdkLoginCompleted: 'accountsSdkLoginCompleted';
  accountsSdkFedLoginLinkAccountsScreenShowed: 'accountsSdkFedLoginLinkAccountsScreenShowed';
  accountsSdkFedLoginLinkAccountsScreenDismissed: 'accountsSdkFedLoginLinkAccountsScreenDismissed';
  accountsSdkFedLoginScreenDismissedAfterSuccessLoginNoLink: 'accountsSdkFedLoginScreenDismissedAfterSuccessLoginNoLink';
  accountsSdkFedLoginLinkAccountsButtonPressed: 'accountsSdkFedLoginLinkAccountsButtonPressed';
  accountsSdkFedLoginNoThanksButtonPressed: 'accountsSdkFedLoginNoThanksButtonPressed';
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
  purchaseSdkDidReportUalPageView: UalPageViewData;
  purchaseSdkDidReportUalCommerceEvent: UalCommerceEventData;
  purchaseSdkDidReportUalViewItem: UalViewItemData;
  purchaseSdkDidReportUalUserAction: UalUserActionData;
  purchaseSdkDidErrorOnPageLoad: WebErrorData;
  purchaseSdkDidErrorOnWebpage: WebErrorData;
  prePurchaseSdkDidFirePageView: UalPageViewData;
  prePurchaseSdkDidShare: PrePurchaseShareData;
  prePurchaseSdkDidReportUalUserAction: UalUserActionData;
  prePurchaseSdkDidErrorOnPageLoad: WebErrorData;
  prePurchaseSdkDidErrorOnWebpage: WebErrorData;
  prePurchaseSdkDidStartLoadingPage: PrePurchasePageStartData;
  prePurchaseSdkDidCompletePageLoad: PrePurchasePageLoadData;
  prePurchaseSdkDidTimeoutPageLoad: PrePurchasePageLoadData;
  prePurchaseSdkDidSelectEvent: PrePurchaseEventSelectionData;
  prePurchaseSdkDidEncounterUnsupportedUrl: PrePurchaseUnsupportedUrlData;
  prePurchaseSdkDidLoadPage: PrePurchasePageLoadedData;
  ticketsSdkDidViewEvents: 'ticketsSdkDidViewEvents';
  ticketsSdkDidViewEventTickets: TicketsSdkEventTicketsData;
  ticketsSdkDidViewTicketBarcode: TicketsSdkTicketData;
  ticketsSdkDidViewTicketDetails: TicketsSdkTicketData;
  ticketsSdkDidViewMfaForTicketOperation: 'ticketsSdkDidViewMfaForTicketOperation';
  ticketsSdkDidViewMfaForViewBarcode: 'ticketsSdkDidViewMfaForViewBarcode';
  ticketsSdkDidViewMfaForWebpage: 'ticketsSdkDidViewMfaForWebpage';
  ticketsSdkDidAddTicketToWallet: TicketsSdkTicketData;
  ticketsSdkDidInitiateTransfer: TicketsSdkTransferData;
  ticketsSdkDidCancelTransfer: TicketsSdkCancelTransferData;
  ticketsSdkDidCancelResale: TicketsSdkCancelResaleData;
  ticketsSdkDidTakeBarcodeScreenshot: TicketsSdkTicketData;
  ticketsSdkDidPullToRefreshEvents: TicketsSdkRefreshData;
  ticketsSdkModalDidDismiss: 'ticketsSdkModalDidDismiss';
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
  ACCOUNTS_SDK_LOGIN_PRESENTED = 'accountsSdkLoginPresented',
  ACCOUNTS_SDK_LOGGED_IN = 'accountsSdkLoggedIn',
  ACCOUNTS_SDK_LOGIN_ABORTED = 'accountsSdkLoginAborted',
  ACCOUNTS_SDK_LOGIN_FAILED = 'accountsSdkLoginFailed',
  ACCOUNTS_SDK_LOGIN_LINK_ACCOUNT_PRESENTED = 'accountsSdkLoginLinkAccountPresented',
  ACCOUNTS_SDK_LOGIN_ACCOUNT_PRESENTED = 'accountsSdkLoginAccountPresented',
  ACCOUNTS_SDK_LOGIN_ACCOUNT_COMPLETED = 'accountsSdkLoginAccountCompleted',
  ACCOUNTS_SDK_LOGIN_COMPLETED = 'accountsSdkLoginCompleted',
  ACCOUNTS_SDK_FED_LOGIN_LINK_ACCOUNTS_SCREEN_SHOWED = 'accountsSdkFedLoginLinkAccountsScreenShowed',
  ACCOUNTS_SDK_FED_LOGIN_LINK_ACCOUNTS_SCREEN_DISMISSED = 'accountsSdkFedLoginLinkAccountsScreenDismissed',
  ACCOUNTS_SDK_FED_LOGIN_SCREEN_DISMISSED_AFTER_SUCCESS_LOGIN_NO_LINK = 'accountsSdkFedLoginScreenDismissedAfterSuccessLoginNoLink',
  ACCOUNTS_SDK_FED_LOGIN_LINK_ACCOUNTS_BUTTON_PRESSED = 'accountsSdkFedLoginLinkAccountsButtonPressed',
  ACCOUNTS_SDK_FED_LOGIN_NO_THANKS_BUTTON_PRESSED = 'accountsSdkFedLoginNoThanksButtonPressed',
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
  PURCHASE_SDK_DID_REPORT_UAL_PAGE_VIEW = 'purchaseSdkDidReportUalPageView',
  PURCHASE_SDK_DID_REPORT_UAL_COMMERCE_EVENT = 'purchaseSdkDidReportUalCommerceEvent',
  PURCHASE_SDK_DID_REPORT_UAL_VIEW_ITEM = 'purchaseSdkDidReportUalViewItem',
  PURCHASE_SDK_DID_REPORT_UAL_USER_ACTION = 'purchaseSdkDidReportUalUserAction',
  PURCHASE_SDK_DID_ERROR_ON_PAGE_LOAD = 'purchaseSdkDidErrorOnPageLoad',
  PURCHASE_SDK_DID_ERROR_ON_WEBPAGE = 'purchaseSdkDidErrorOnWebpage',
  PRE_PURCHASE_SDK_DID_FIRE_PAGE_VIEW = 'prePurchaseSdkDidFirePageView',
  PRE_PURCHASE_SDK_DID_SHARE = 'prePurchaseSdkDidShare',
  PRE_PURCHASE_SDK_DID_REPORT_UAL_USER_ACTION = 'prePurchaseSdkDidReportUalUserAction',
  PRE_PURCHASE_SDK_DID_ERROR_ON_PAGE_LOAD = 'prePurchaseSdkDidErrorOnPageLoad',
  PRE_PURCHASE_SDK_DID_ERROR_ON_WEBPAGE = 'prePurchaseSdkDidErrorOnWebpage',
  PRE_PURCHASE_SDK_DID_START_LOADING_PAGE = 'prePurchaseSdkDidStartLoadingPage',
  PRE_PURCHASE_SDK_DID_COMPLETE_PAGE_LOAD = 'prePurchaseSdkDidCompletePageLoad',
  PRE_PURCHASE_SDK_DID_TIMEOUT_PAGE_LOAD = 'prePurchaseSdkDidTimeoutPageLoad',
  PRE_PURCHASE_SDK_DID_SELECT_EVENT = 'prePurchaseSdkDidSelectEvent',
  PRE_PURCHASE_SDK_DID_ENCOUNTER_UNSUPPORTED_URL = 'prePurchaseSdkDidEncounterUnsupportedUrl',
  PRE_PURCHASE_SDK_DID_LOAD_PAGE = 'prePurchaseSdkDidLoadPage',
  TICKETS_SDK_DID_VIEW_EVENTS = 'ticketsSdkDidViewEvents',
  TICKETS_SDK_DID_VIEW_EVENT_TICKETS = 'ticketsSdkDidViewEventTickets',
  TICKETS_SDK_DID_VIEW_TICKET_BARCODE = 'ticketsSdkDidViewTicketBarcode',
  TICKETS_SDK_DID_VIEW_TICKET_DETAILS = 'ticketsSdkDidViewTicketDetails',
  TICKETS_SDK_DID_VIEW_MFA_FOR_TICKET_OPERATION = 'ticketsSdkDidViewMfaForTicketOperation',
  TICKETS_SDK_DID_VIEW_MFA_FOR_VIEW_BARCODE = 'ticketsSdkDidViewMfaForViewBarcode',
  TICKETS_SDK_DID_VIEW_MFA_FOR_WEBPAGE = 'ticketsSdkDidViewMfaForWebpage',
  TICKETS_SDK_DID_ADD_TICKET_TO_WALLET = 'ticketsSdkDidAddTicketToWallet',
  TICKETS_SDK_DID_INITIATE_TRANSFER = 'ticketsSdkDidInitiateTransfer',
  TICKETS_SDK_DID_CANCEL_TRANSFER = 'ticketsSdkDidCancelTransfer',
  TICKETS_SDK_DID_CANCEL_RESALE = 'ticketsSdkDidCancelResale',
  TICKETS_SDK_DID_TAKE_BARCODE_SCREENSHOT = 'ticketsSdkDidTakeBarcodeScreenshot',
  TICKETS_SDK_DID_PULL_TO_REFRESH_EVENTS = 'ticketsSdkDidPullToRefreshEvents',
  TICKETS_SDK_DID_DISMISS = 'ticketsSdkModalDidDismiss',
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

export type AccessToken = {
  accessToken: string;
  sportXRIdToken: string;
} | null;

export type SportXrData = {
  sportXRcookieName?: string;
  sportXRTeamDomain?: string;
} | null;

export type MemberInfo = Record<string, any> | null;

export type CustomModuleHeaderView = { color: string } | { image: any };

export type CustomModules = {
  headerView?: CustomModuleHeaderView;
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
