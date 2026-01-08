import React, { createContext, useCallback, useEffect, useState } from 'react';
import {
  NativeModules,
  NativeEventEmitter,
  Platform,
  Image,
} from 'react-native';
import NativeAccountsSdk from '../specs/NativeAccountsSdk';
import NativeConfig from '../specs/NativeConfig';
import { toCapitalise } from './utils/utils';
import {
  AccessToken,
  MarketDomain,
  Region,
  EventHeaderType,
  IgniteAnalytics,
  PrebuiltModules,
  CustomModules,
  SportXrData,
  VenueConcessionsModule,
} from './types';

type LoginParams = {
  onLogin?: () => void | Promise<void>;
  skipUpdate?: boolean;
};

type LogoutParams = {
  onLogout?: () => void | Promise<void>;
  skipUpdate?: boolean;
};

type AuthStateParams = {
  isConfigured: boolean;
  isLoggedIn: boolean;
  memberInfo: Record<string, any> | null;
};

interface IgniteProviderProps {
  children: React.ReactNode;
  autoUpdate?: boolean;
  prebuiltModules?: PrebuiltModules;
  customModules?: CustomModules;
  enableLogs?: boolean;
  analytics?: (data: IgniteAnalytics) => void | Promise<void>;
  options: {
    apiKey: string;
    clientName: string;
    primaryColor: string;
    environment?: string;
    region?: Region;
    marketDomain?: MarketDomain;
    eventHeaderType?: EventHeaderType;
  };
}

type RefreshConfigParams = {
  apiKey: string;
  clientName?: string;
  primaryColor?: string;
  environment?: string;
  region?: Region;
  marketDomain?: MarketDomain;
  eventHeaderType?: EventHeaderType;
  skipAutoLogin?: boolean;
  skipUpdate?: boolean;
  onSuccess?: () => void | Promise<void>;
  onLoginSuccess?: () => void | Promise<void>;
};

type IgniteContextType = {
  login: (loginParams?: LoginParams) => Promise<void>;
  logout: (logoutParams?: LogoutParams) => Promise<void>;
  logoutAll: (logoutParams?: LogoutParams) => Promise<void>;
  getIsLoggedIn: () => Promise<boolean>;
  getToken: () => Promise<AccessToken>;
  getSportXrData: () => Promise<SportXrData>;
  getMemberInfo: () => Promise<Record<string, any> | null>;
  refreshToken: () => Promise<AccessToken>;
  refreshConfiguration: (
    refreshConfigParams: RefreshConfigParams
  ) => Promise<void>;
  setTicketDeepLink: (id: string) => void;
  authState: AuthStateParams;
  isLoggingIn: boolean;
};

export const IgniteContext = createContext<IgniteContextType>({
  login: async () => {},
  logout: async () => {},
  logoutAll: async () => {},
  getIsLoggedIn: async () => false,
  getToken: async () => null,
  getSportXrData: async () => null,
  getMemberInfo: async () => null,
  refreshToken: async () => null,
  refreshConfiguration: async () => {},
  setTicketDeepLink: () => {},
  isLoggingIn: false,
  authState: {
    isConfigured: false,
    isLoggedIn: false,
    memberInfo: null,
  },
});

const defaultPrebuiltModules: PrebuiltModules = {
  moreTicketActionsModule: {
    enabled: false,
  },
  venueDirectionsModule: {
    enabled: false,
  },
  seatUpgradesModule: {
    enabled: false,
  },
  venueConcessionsModule: {
    enabled: false,
    dismissTicketViewOrderIos: true,
    dismissTicketViewWalletIos: true,
    orderButtonCallback: async () => {},
    walletButtonCallback: async () => {},
  },
  invoiceModule: {
    enabled: false,
  },
};

const defaultCustomModules: CustomModules = {
  button1: {
    enabled: false,
    title: '',
    dismissTicketViewIos: true,
    callback: async () => {},
  },
  button2: {
    enabled: false,
    title: '',
    dismissTicketViewIos: true,
    callback: async () => {},
  },
  button3: {
    enabled: false,
    title: '',
    dismissTicketViewIos: true,
    callback: async () => {},
  },
};

export const IgniteProvider: React.FC<IgniteProviderProps> = ({
  children,
  options,
  autoUpdate = true,
  enableLogs = false,
  prebuiltModules = defaultPrebuiltModules,
  customModules = defaultCustomModules,
  analytics,
}) => {
  const {
    apiKey,
    clientName,
    primaryColor,
    environment = 'Production',
    region,
    eventHeaderType,
    marketDomain,
  } = options;
  const { venueConcessionsModule } = prebuiltModules;
  const { button1, button2, button3 } = customModules;
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [authState, setAuthState] = useState<AuthStateParams>({
    isConfigured: false,
    isLoggedIn: false,
    memberInfo: null,
  });

  const setAccountDetails = useCallback(async () => {
    let _isLoggedIn = false;
    let isLoggedInResult;
    let memberInfoResult;
    try {
      try {
        isLoggedInResult = await NativeAccountsSdk.isLoggedIn();
      } catch (e) {
        if ((e as Error).message.includes('User not logged in'))
          throw new Error(`User not logged in`);
        throw new Error(`Accounts SDK isLoggedIn error: ${e}`);
      }

      const isLoggedInParsed = isLoggedInResult;
      _isLoggedIn = isLoggedInParsed;

      try {
        memberInfoResult = await NativeAccountsSdk.getMemberInfo();
      } catch (e) {
        if ((e as Error).message.includes('User not logged in'))
          throw new Error(`User not logged in`);
        throw new Error(`Accounts SDK memberInfo error: ${e}`);
      }

      setAuthState({
        isConfigured: true,
        isLoggedIn: !!isLoggedInParsed,
        memberInfo: memberInfoResult,
      });
    } catch (e) {
      if ((e as Error).message.includes('User not logged in')) {
        setAuthState({
          isConfigured: true,
          isLoggedIn: false,
          memberInfo: null,
        });
      } else {
        setAuthState({
          isConfigured: true,
          isLoggedIn: !!_isLoggedIn,
          memberInfo: null,
        });
        throw e;
      }
    }
  }, []);

  const configureAccountsSDK = useCallback(async () => {
    try {
      const result = await NativeAccountsSdk.configureAccountsSDK();
      enableLogs && console.log(result);
    } catch (e) {
      throw new Error(
        `Accounts SDK configuration error: ${(e as Error).message}`
      );
    }
    try {
      autoUpdate && (await setAccountDetails());
    } catch (e) {
      throw e;
    }
  }, [autoUpdate, enableLogs, setAccountDetails]);

  const setNativeConfigValues = useCallback(() => {
    NativeConfig.setConfig('apiKey', apiKey);
    NativeConfig.setConfig('clientName', clientName);
    NativeConfig.setConfig('primaryColor', primaryColor);
    NativeConfig.setConfig('region', region || 'US');
    NativeConfig.setConfig('marketDomain', marketDomain || 'US');
    NativeConfig.setConfig(
      'eventHeaderType',
      eventHeaderType || 'EVENT_INFO_SHARE'
    );

    if (
      environment === 'Production' ||
      environment === 'PreProduction' ||
      environment === 'Staging'
    )
      NativeConfig.setConfig('environment', environment);
  }, [
    apiKey,
    clientName,
    primaryColor,
    region,
    marketDomain,
    eventHeaderType,
    environment,
  ]);

  const setTicketSdkModules = useCallback(() => {
    // // Prebuilt Modules
    // Object.entries(prebuiltModules).forEach(([moduleName, moduleOptions]) => {
    //   // Crash on iOS when boolean sent to bridge module
    //   const isEnabled = moduleOptions.enabled ? 'true' : 'false';
    //   NativeConfig.setConfig(moduleName, isEnabled);

    //   if (moduleName === 'venueConcessionsModule') {
    //     const dismissTicketViewOrder =
    //       (moduleOptions as VenueConcessionsModule)
    //         .dismissTicketViewOrderIos === undefined
    //         ? 'true'
    //         : `${(moduleOptions as VenueConcessionsModule).dismissTicketViewOrderIos}`;
    //     const dismissTicketViewWallet =
    //       (moduleOptions as VenueConcessionsModule)
    //         .dismissTicketViewWalletIos === undefined
    //         ? 'true'
    //         : `${(moduleOptions as VenueConcessionsModule).dismissTicketViewWalletIos}`;

    //     NativeConfig.setConfig(
    //       `${moduleName}DismissTicketViewOrder`,
    //       dismissTicketViewOrder
    //     );

    //     NativeConfig.setConfig(
    //       `${moduleName}DismissTicketViewWallet`,
    //       dismissTicketViewWallet
    //     );
    //   }

    //   Object.entries(moduleOptions).forEach(
    //     ([optionName, optionValue]: [string, any]) => {
    //       if (optionName.includes('Label')) {
    //         NativeConfig.setConfig(
    //           `${moduleName}${toCapitalise(optionName)}`,
    //           optionValue
    //         );
    //       }
    //       if (optionName.includes('image')) {
    //         const resolvedImage = Image.resolveAssetSource(optionValue);
    //         NativeConfig.setImage(moduleName + 'Image', resolvedImage);
    //       }
    //     }
    //   );
    // });

    // // Custom Modules
    // Object.entries(customModules).forEach(([moduleName, moduleOptions]) => {
    //   const isEnabled = moduleOptions.enabled ? 'true' : 'false';
    //   // Crash on iOS when boolean sent to bridge module so strings sent instead `${moduleOptions.dismissTicketViewIos}`
    //   const dismissTicketView =
    //     moduleOptions.dismissTicketViewIos === undefined
    //       ? 'true'
    //       : `${moduleOptions.dismissTicketViewIos}`;
    //   NativeConfig.setConfig(moduleName, isEnabled);
    //   NativeConfig.setConfig(`${moduleName}Title`, moduleOptions.title);
    //   NativeConfig.setConfig(
    //     `${moduleName}DismissTicketView`,
    //     dismissTicketView
    //   );
    // });
  }, [customModules, prebuiltModules]);

  const setTicketDeepLink = useCallback((id: string) => {
    NativeConfig.setConfig('orderIdDeepLink', id);
  }, []);

  useEffect(() => {
    const onConfigureAccountsSdk = async () => {
      setNativeConfigValues();
      setTicketSdkModules();
      try {
        await configureAccountsSDK();
      } catch (e) {
        if (
          (e as Error).message.includes('Accounts SDK configuration error:')
        ) {
          console.error(`${(e as Error).message}`);
        } else {
          console.log(`${(e as Error).message}`);
        }
      }
    };
    onConfigureAccountsSdk();

    // Only run initial configuration once in an apps lifecycle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   const igniteEventEmitter = new NativeEventEmitter(
  //     NativeModules.GlobalEventEmitter
  //   );
  //   igniteEventEmitter.addListener(
  //     'igniteAnalytics',
  //     async (result: IgniteAnalytics) => {
  //       if (result && analytics) analytics(result);
  //       if (
  //         (result.purchaseSdkDidEndCheckoutFor ||
  //           result.ticketsSdkDidViewEvents ||
  //           // iOS TMAuthentication.shared.validToken() successful login
  //           ((result.accountsSdkLoggedIn || result.accountsSdkLoggedOut) &&
  //             !isLoggingIn &&
  //             Platform.OS === 'ios')) &&
  //         autoUpdate
  //       ) {
  //         await setAccountDetails();
  //       }
  //       if (result.ticketsSdkVenueConcessionsOrderFor) {
  //         venueConcessionsModule?.orderButtonCallback(
  //           result.ticketsSdkVenueConcessionsOrderFor
  //         );
  //       }
  //       if (result.ticketsSdkVenueConcessionsWalletFor) {
  //         venueConcessionsModule?.walletButtonCallback(
  //           result.ticketsSdkVenueConcessionsWalletFor
  //         );
  //       }
  //       if (result.ticketsSdkCustomModuleButton1) {
  //         button1?.callback(result.ticketsSdkCustomModuleButton1);
  //       }
  //       if (result.ticketsSdkCustomModuleButton2) {
  //         button2?.callback(result.ticketsSdkCustomModuleButton2);
  //       }
  //       if (result.ticketsSdkCustomModuleButton3) {
  //         button3?.callback(result.ticketsSdkCustomModuleButton3);
  //       }
  //     }
  //   );

  //   // Removes the listener once unmounted
  //   return () => {
  //     igniteEventEmitter.removeAllListeners('igniteAnalytics');
  //   };
  //   // Only create native listener once in an apps lifecycle
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const login = useCallback(
    async (
      { onLogin, skipUpdate }: LoginParams = { skipUpdate: false }
    ): Promise<void> => {
      !skipUpdate && setIsLoggingIn(true);
      try {
        const result = await NativeAccountsSdk.login();
        if (
          (Platform.OS === 'ios' && result?.accessToken) ||
          (Platform.OS === 'android' && result?.resultCode === -1)
        ) {
          enableLogs && console.log('Accounts SDK login successful');
          !skipUpdate && autoUpdate && (await setAccountDetails());
          //avoid await on callbacks passed to library as there is no guarantee how long they will take to resolve
          onLogin && onLogin();
        }
      } catch (e) {
        !skipUpdate && setIsLoggingIn(false);
        throw e;
      }
      !skipUpdate && setIsLoggingIn(false);
    },
    [autoUpdate, enableLogs, setAccountDetails]
  );

  const logout = useCallback(
    async (
      { onLogout, skipUpdate }: LogoutParams = { skipUpdate: false }
    ): Promise<void> => {
      try {
        await NativeAccountsSdk.logout();
        enableLogs && console.log('Accounts SDK logout successful');
        !skipUpdate && autoUpdate && (await setAccountDetails());
        onLogout && onLogout();
      } catch (e) {
        throw e;
      }
    },
    [autoUpdate, enableLogs, setAccountDetails]
  );

  const logoutAll = useCallback(
    // eslint-disable-next-line prettier/prettier
    async (
      { onLogout, skipUpdate }: LogoutParams = { skipUpdate: false }
    ): Promise<void> => {
      try {
        await NativeAccountsSdk.logoutAll();
        enableLogs && console.log('Accounts SDK logoutAll successful');
        !skipUpdate && autoUpdate && (await setAccountDetails());
        onLogout && onLogout();
      } catch (e) {
        throw e;
      }
    },
    [autoUpdate, enableLogs, setAccountDetails]
  );

  const getIsLoggedIn = useCallback(async (): Promise<boolean> => {
    try {
      const result = await NativeAccountsSdk.isLoggedIn();
      enableLogs && console.log(`Accounts SDK isLoggedIn: ${result}`);
      return result;
    } catch (e) {
      if ((e as Error).message.includes('User not logged in')) {
        enableLogs && console.log('Accounts SDK isLoggedIn: false');
        return false;
      } else {
        throw e;
      }
    }
  }, [enableLogs]);

  const getToken = useCallback(async (): Promise<AccessToken> => {
    try {
      // iOS getToken() has the exact same Native logic as refreshToken, but will not display the login UI if a user is not logged in or has an invalidated token
      // Android getToken() never shows the login UI if a user is not logged in or has an invalidated token, so showing login is done manually in JS refreshToken()
      const result = await NativeAccountsSdk.getToken();
      const accessToken = result?.accessToken === '' ? null : result;
      enableLogs &&
        console.log(
          `Accounts SDK access token: ${JSON.stringify(accessToken)}`
        );
      return accessToken;
    } catch (e) {
      if ((e as Error).message.includes('User not logged in')) {
        enableLogs && console.log('Accounts SDK access token: null');
        return null;
      } else {
        throw e;
      }
    }
  }, [enableLogs]);

  const getSportXrData = useCallback(async (): Promise<SportXrData> => {
    try {
      const result = await NativeAccountsSdk.getSportXRData();
      enableLogs &&
        console.log(
          `Accounts SDK SportXr Data retrieved: ${JSON.stringify(result)}`
        );
      return result;
    } catch (e) {
      throw e;
    }
  }, [enableLogs]);

  const getMemberInfo = useCallback(async () => {
    let result;
    try {
      result = await NativeAccountsSdk.getMemberInfo();
      enableLogs &&
        console.log(`Accounts SDK memberInfo: ${JSON.stringify(result)}`);
      return result;
    } catch (e) {
      if ((e as Error).message.includes('User not logged in')) {
        enableLogs && console.log('Accounts SDK memberInfo: null');
        return null;
      } else {
        throw e;
      }
    }
  }, [enableLogs]);

  const refreshToken = useCallback(async (): Promise<AccessToken> => {
    try {
      const result = await NativeAccountsSdk.refreshToken();
      if (Platform.OS === 'ios') {
        // login() is automatically triggered in the iOS Accounts SDK refreshToken() method via TMAuthentication.shared.validToken()
        enableLogs &&
          console.log(`Accounts SDK access token: ${JSON.stringify(result)}`);
        return result?.accessToken === '' ? null : result;
      } else {
        if (result === null) {
          await login();
          // The JS getToken() method already returns the destructured access token
          return await getToken();
        } else {
          enableLogs &&
            console.log(`Accounts SDK access token: ${JSON.stringify(result)}`);
          return result;
        }
      }
    } catch (e) {
      if ((e as Error).message.includes('User not logged in')) {
        enableLogs && console.log('Accounts SDK refresh token: null');
        return null;
      } else {
        throw e;
      }
    }
  }, [enableLogs, getToken, login]);

  const refreshConfiguration = useCallback(
    async (
      {
        apiKey,
        clientName,
        primaryColor,
        environment,
        region,
        marketDomain,
        eventHeaderType,
        skipAutoLogin,
        skipUpdate,
        onSuccess,
        onLoginSuccess,
      }: RefreshConfigParams = {
        apiKey: '',
        skipAutoLogin: false,
        skipUpdate: false,
        onLoginSuccess: () => {},
      }
    ) => {
      try {
        NativeConfig.setConfig('apiKey', apiKey);
        clientName && NativeConfig.setConfig('clientName', clientName);
        primaryColor && NativeConfig.setConfig('primaryColor', primaryColor);
        region && NativeConfig.setConfig('region', region);
        marketDomain && NativeConfig.setConfig('marketDomain', marketDomain);
        eventHeaderType &&
          NativeConfig.setConfig('eventHeaderType', eventHeaderType);
        if (
          environment === 'Production' ||
          environment === 'PreProduction' ||
          environment === 'Staging'
        )
          NativeConfig.setConfig('environment', environment);
        await configureAccountsSDK();
        onSuccess && onSuccess();
        !skipAutoLogin &&
          (await login({ onLogin: onLoginSuccess, skipUpdate }));
      } catch (e) {
        throw e;
      }
    },
    [configureAccountsSDK, login]
  );

  return (
    <IgniteContext.Provider
      value={{
        login,
        logout,
        logoutAll,
        getIsLoggedIn,
        getToken,
        getSportXrData,
        getMemberInfo,
        refreshToken,
        refreshConfiguration,
        setTicketDeepLink,
        authState,
        isLoggingIn,
      }}
    >
      {children}
    </IgniteContext.Provider>
  );
};
