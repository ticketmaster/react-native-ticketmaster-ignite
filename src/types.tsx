type PurchaseSdkBeginData = {
  eventId: string;
  legacyId: string;
  eventName: string;
  date: string;
  timeZone: string;
};

type PurchaseSdkEndData = {
  eventId: string;
  legacyId: string;
  eventName: string;
  date: string;
  timeZone: string;
  reason: string;
};

type PurchaseSdkMakePurchaseData = {
  eventId: string;
  legacyId: string;
  eventName: string;
  date: string;
  timeZone: string;
  orderId: string;
  orderName: string;
};

type PurchaseSdkPressNavBarData = {
  eventId: string;
  legacyId: string;
  eventName: string;
  button: string;
};

type PurchaseSdkShareData = {
  eventId: string;
  legacyId: string;
  eventName: string;
  activityType: string;
};

type PurchaseSdkSubPageData = {
  eventId: string;
  legacyId: string;
  eventName: string;
  subPage: string;
};

type PurchaseSdkMakeDecisionData = {
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
  faceValue?: string;
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

type TicketsSdkEventInfoData = {
  eventId: string;
  eventName: string;
};

type TicketsSdkModuleActionData = {
  eventId: string;
  eventName: string;
  moduleId: string;
  buttonTitle: string;
  buttonCallback: string;
};

type TicketsSdkAcceptTransferData = {
  eventId: string;
  eventName: string;
  transferId: string;
};

type TicketsSdkShareTransferData = {
  eventId: string;
  eventName: string;
};

type TicketsSdkFinishAddTicketToWalletData = {
  eventId: string;
  eventName: string;
  ticketCount: number;
  tickets: Array<{
    section: string;
    row: string;
    seat: string;
  }>;
};

type RetailSdkUalPageViewData = {
  pageName: string;
  pageUrl: string;
  pageReferrer?: string;
  pageType: string;
};

type PurchaseSdkUalCommerceEventData = {
  eventType: string;
  eventName: string;
  transactionId: string;
  transactionTotal: string;
};

type PurchaseSdkUalViewItemData = {
  itemId: string;
  itemName: string;
  itemCategory: string;
  itemVariant: string;
};

type RetailSdkUalUserActionData = {
  actionType: string;
  actionLabel: string;
  actionValue: string;
  actionName: string;
  actionCategory: string;
};

type RetailSdkWebErrorData = {
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
  accountsSdkLoginAccountCompleted: 'accountsSdkLoginAccountCompleted';
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
  purchaseSdkDidBeginTicketSelectionFor: PurchaseSdkBeginData;
  purchaseSdkDidEndTicketSelectionFor: PurchaseSdkEndData;
  purchaseSdkDidBeginCheckoutFor: PurchaseSdkBeginData;
  purchaseSdkDidEndCheckoutFor: PurchaseSdkEndData;
  purchaseSdkDidMakePurchaseFor: PurchaseSdkMakePurchaseData;
  purchaseSdkDidPressNavBarButtonFor: PurchaseSdkPressNavBarData;
  purchaseSdkDidShare: PurchaseSdkShareData;
  purchaseSdkDidViewSubPageFor: PurchaseSdkSubPageData;
  purchaseSdkDidMakeDecisionFor: PurchaseSdkMakeDecisionData;
  purchaseSdkManageMyTickets: 'purchaseSdkManageMyTickets';
  purchaseSdkWebPageDidReportUALPageView: RetailSdkUalPageViewData;
  purchaseSdkWebPageDidReportUALCommerceEvent: PurchaseSdkUalCommerceEventData;
  purchaseSdkWebReportedViewItem: PurchaseSdkUalViewItemData;
  purchaseSdkWebPageDidReportUALUserAction: RetailSdkUalUserActionData;
  purchaseSdkPageLoadDidErrorFor: RetailSdkWebErrorData;
  purchaseSdkWebPageDidErrorFor: RetailSdkWebErrorData;
  prePurchaseSdkDidFirePageView: RetailSdkUalPageViewData;
  prePurchaseSdkDidShare: PrePurchaseShareData;
  prePurchaseSdkDidReportUalUserAction: RetailSdkUalUserActionData;
  prePurchaseSdkPageLoadDidErrorFor: RetailSdkWebErrorData;
  prePurchaseSdkWebPageDidErrorFor: RetailSdkWebErrorData;
  prePurchaseSdkWebPageDidReportLoadingPage: PrePurchasePageStartData;
  prePurchaseSdkWebPageDidReportPageLoadComplete: PrePurchasePageLoadData;
  prePurchaseSdkWebPageDidReportProgressBarTimeout: PrePurchasePageLoadData;
  prePurchaseSdkDidBeginTicketSelectionFor: PrePurchaseEventSelectionData;
  prePurchaseSdkDidEncounterUnsupportedUrl: PrePurchaseUnsupportedUrlData;
  prePurchaseSdkDidLoadPage: PrePurchasePageLoadedData;
  ticketsSdkDidViewEvents: 'ticketsSdkDidViewEvents';
  ticketsSdkDidViewEventTickets: TicketsSdkEventTicketsData;
  ticketsSdkDidViewTicketBarcode: TicketsSdkTicketData;
  ticketsSdkDidViewTicketDetails: TicketsSdkTicketData;
  ticketsSdkDidViewMfaForTicketOperation: 'ticketsSdkDidViewMfaForTicketOperation';
  ticketsSdkDidViewMfaForViewBarcode: 'ticketsSdkDidViewMfaForViewBarcode';
  ticketsSdkDidViewMfaForWebpage: 'ticketsSdkDidViewMfaForWebpage';
  ticketsSdkDidViewEventModules: TicketsSdkEventTicketsData;
  ticketsSdkDidViewTicketDelivery: TicketsSdkTicketData;
  ticketsSdkDidViewEventInfoBanner: TicketsSdkEventInfoData;
  ticketsSdkDidInitiateAddTicketToWallet: TicketsSdkTicketData;
  ticketsSdkDidFinishAddTicketToWallet:
    | TicketsSdkFinishAddTicketToWalletData
    | 'ticketsSdkDidFinishAddTicketToWallet';
  ticketsSdkDidCancelAddTicketToWallet: 'ticketsSdkDidCancelAddTicketToWallet';
  ticketsSdkDidInitiateTransfer: TicketsSdkTransferData;
  ticketsSdkDidCancelTransfer: TicketsSdkCancelTransferData;
  ticketsSdkDidAcceptTransfer: TicketsSdkAcceptTransferData;
  ticketsSdkDidEditResale: TicketsSdkEventTicketsData;
  ticketsSdkDidCancelResale: TicketsSdkCancelResaleData;
  ticketsSdkDidShareTransfer: TicketsSdkShareTransferData;
  ticketsSdkDidTakeBarcodeScreenshot: TicketsSdkTicketData;
  ticketsSdkDidPullToRefreshEvents: TicketsSdkRefreshData;
  ticketsSdkDidPressEventInfoBanner: TicketsSdkEventInfoData;
  ticketsSdkDidPressModuleActionButton: TicketsSdkModuleActionData;
  ticketsSdkDidPressNavbarButton: TicketsSdkEventInfoData;
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
  ACCOUNTS_SDK_LOGIN_ACCOUNT_COMPLETED = 'accountsSdkLoginAccountCompleted',
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
  PURCHASE_SDK_WEB_PAGE_DID_REPORT_UAL_PAGE_VIEW = 'purchaseSdkWebPageDidReportUALPageView',
  PURCHASE_SDK_WEB_PAGE_DID_REPORT_UAL_COMMERCE_EVENT = 'purchaseSdkWebPageDidReportUALCommerceEvent',
  PURCHASE_SDK_WEB_REPORTED_VIEW_ITEM = 'purchaseSdkWebReportedViewItem',
  PURCHASE_SDK_WEB_PAGE_DID_REPORT_UAL_USER_ACTION = 'purchaseSdkWebPageDidReportUALUserAction',
  PURCHASE_SDK_PAGE_LOAD_DID_ERROR_FOR = 'purchaseSdkPageLoadDidErrorFor',
  PURCHASE_SDK_WEB_PAGE_DID_ERROR_FOR = 'purchaseSdkWebPageDidErrorFor',
  PRE_PURCHASE_SDK_DID_FIRE_PAGE_VIEW = 'prePurchaseSdkDidFirePageView',
  PRE_PURCHASE_SDK_DID_SHARE = 'prePurchaseSdkDidShare',
  PRE_PURCHASE_SDK_DID_REPORT_UAL_USER_ACTION = 'prePurchaseSdkDidReportUalUserAction',
  PRE_PURCHASE_SDK_PAGE_LOAD_DID_ERROR_FOR = 'prePurchaseSdkPageLoadDidErrorFor',
  PRE_PURCHASE_SDK_WEB_PAGE_DID_ERROR_FOR = 'prePurchaseSdkWebPageDidErrorFor',
  PRE_PURCHASE_SDK_WEB_PAGE_DID_REPORT_LOADING_PAGE = 'prePurchaseSdkWebPageDidReportLoadingPage',
  PRE_PURCHASE_SDK_WEB_PAGE_DID_REPORT_PAGE_LOAD_COMPLETE = 'prePurchaseSdkWebPageDidReportPageLoadComplete',
  PRE_PURCHASE_SDK_WEB_PAGE_DID_REPORT_PROGRESS_BAR_TIMEOUT = 'prePurchaseSdkWebPageDidReportProgressBarTimeout',
  PRE_PURCHASE_SDK_DID_BEGIN_TICKET_SELECTION_FOR = 'prePurchaseSdkDidBeginTicketSelectionFor',
  PRE_PURCHASE_SDK_DID_ENCOUNTER_UNSUPPORTED_URL = 'prePurchaseSdkDidEncounterUnsupportedUrl',
  PRE_PURCHASE_SDK_DID_LOAD_PAGE = 'prePurchaseSdkDidLoadPage',
  TICKETS_SDK_DID_VIEW_EVENTS = 'ticketsSdkDidViewEvents',
  TICKETS_SDK_DID_VIEW_EVENT_TICKETS = 'ticketsSdkDidViewEventTickets',
  TICKETS_SDK_DID_VIEW_TICKET_BARCODE = 'ticketsSdkDidViewTicketBarcode',
  TICKETS_SDK_DID_VIEW_TICKET_DETAILS = 'ticketsSdkDidViewTicketDetails',
  TICKETS_SDK_DID_VIEW_MFA_FOR_TICKET_OPERATION = 'ticketsSdkDidViewMfaForTicketOperation',
  TICKETS_SDK_DID_VIEW_MFA_FOR_VIEW_BARCODE = 'ticketsSdkDidViewMfaForViewBarcode',
  TICKETS_SDK_DID_VIEW_MFA_FOR_WEBPAGE = 'ticketsSdkDidViewMfaForWebpage',
  TICKETS_SDK_DID_VIEW_EVENT_MODULES = 'ticketsSdkDidViewEventModules',
  TICKETS_SDK_DID_VIEW_TICKET_DELIVERY = 'ticketsSdkDidViewTicketDelivery',
  TICKETS_SDK_DID_VIEW_EVENT_INFO_BANNER = 'ticketsSdkDidViewEventInfoBanner',
  TICKETS_SDK_DID_INITIATE_ADD_TICKET_TO_WALLET = 'ticketsSdkDidInitiateAddTicketToWallet',
  TICKETS_SDK_DID_FINISH_ADD_TICKET_TO_WALLET = 'ticketsSdkDidFinishAddTicketToWallet',
  TICKETS_SDK_DID_CANCEL_ADD_TICKET_TO_WALLET = 'ticketsSdkDidCancelAddTicketToWallet',
  TICKETS_SDK_DID_INITIATE_TRANSFER = 'ticketsSdkDidInitiateTransfer',
  TICKETS_SDK_DID_CANCEL_TRANSFER = 'ticketsSdkDidCancelTransfer',
  TICKETS_SDK_DID_ACCEPT_TRANSFER = 'ticketsSdkDidAcceptTransfer',
  TICKETS_SDK_DID_EDIT_RESALE = 'ticketsSdkDidEditResale',
  TICKETS_SDK_DID_CANCEL_RESALE = 'ticketsSdkDidCancelResale',
  TICKETS_SDK_DID_SHARE_TRANSFER = 'ticketsSdkDidShareTransfer',
  TICKETS_SDK_DID_TAKE_BARCODE_SCREENSHOT = 'ticketsSdkDidTakeBarcodeScreenshot',
  TICKETS_SDK_DID_PULL_TO_REFRESH_EVENTS = 'ticketsSdkDidPullToRefreshEvents',
  TICKETS_SDK_DID_PRESS_EVENT_INFO_BANNER = 'ticketsSdkDidPressEventInfoBanner',
  TICKETS_SDK_DID_PRESS_MODULE_ACTION_BUTTON = 'ticketsSdkDidPressModuleActionButton',
  TICKETS_SDK_DID_PRESS_NAVBAR_BUTTON = 'ticketsSdkDidPressNavbarButton',
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
