import React, { createContext, useCallback, useEffect, useState } from 'react';
import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import {
  IgniteAnalytics,
  PrebuiltModules,
} from 'react-native-ticketmaster-ignite';
import { toCapitalise } from './utils/utils';
import { EventHeaderType, MarketDomain, Region } from './types';

type AuthSource = {
  hostAccessToken?: string;
  archticsAccessToken?: string;
  mfxAccessToken?: string;
  sportXRAccessToken?: string;
};

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

type AccessToken = string | AuthSource | null;

interface IgniteProviderProps {
  children: React.ReactNode;
  autoUpdate?: boolean;
  prebuiltModules?: PrebuiltModules;
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
  getToken: () => Promise<string | AuthSource | null>;
  getMemberInfo: () => Promise<Record<string, any> | null>;
  refreshToken: () => Promise<string | AuthSource | null>;
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
    orderButtonCallback: async () => {},
    walletButtonCallback: async () => {},
  },
  invoiceModule: {
    enabled: false,
  },
};

export const IgniteProvider: React.FC<IgniteProviderProps> = ({
  children,
  options,
  autoUpdate = true,
  prebuiltModules = defaultPrebuiltModules,
  analytics,
}) => {
  const { Config, AccountsSDK } = NativeModules;
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
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [authState, setAuthState] = useState<AuthStateParams>({
    isConfigured: false,
    isLoggedIn: false,
    memberInfo: null,
  });

  const setAccountDetails = useCallback(async () => {
    let _isLoggedIn = false;
    try {
      const isLoggedInResult = await AccountsSDK.isLoggedIn();
      const isLoggedInParsed =
        Platform.OS === 'ios' ? isLoggedInResult.result : isLoggedInResult;
      _isLoggedIn = isLoggedInParsed;

      const memberInfoResult = await AccountsSDK.getMemberInfo();

      setAuthState({
        isConfigured: true,
        isLoggedIn: !!isLoggedInParsed,
        memberInfo:
          Platform.OS === 'ios'
            ? memberInfoResult
            : JSON.parse(memberInfoResult),
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
  }, [AccountsSDK]);

  const configureAccountsSDK = useCallback(async () => {
    try {
      const result = await AccountsSDK.configureAccountsSDK();
      console.log(result);
      autoUpdate && (await setAccountDetails());
    } catch (e) {
      throw e;
    }
  }, [AccountsSDK, autoUpdate, setAccountDetails]);

  const setNativeConfigValues = useCallback(() => {
    Config.setConfig('apiKey', apiKey);
    Config.setConfig('clientName', clientName);
    Config.setConfig('primaryColor', primaryColor);
    Config.setConfig('region', region || 'US');
    Config.setConfig('marketDomain', marketDomain || 'US');
    Config.setConfig('eventHeaderType', eventHeaderType || 'EVENT_INFO_SHARE');

    if (
      environment === 'Production' ||
      environment === 'PreProduction' ||
      environment === 'Staging'
    )
      Config.setConfig('environment', environment);

    const resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource');

    Object.entries(prebuiltModules).forEach(([moduleName, moduleOptions]) => {
      // Crash on iOS when boolean sent to bridge module
      const isEnabled = moduleOptions.enabled ? 'true' : 'false';
      Config.setConfig(moduleName, isEnabled);

      Object.entries(moduleOptions).forEach(([optionName, optionValue]) => {
        if (optionName.includes('Label')) {
          Config.setConfig(
            `${moduleName}${toCapitalise(optionName)}`,
            optionValue
          );
        }
        if (optionName.includes('image')) {
          const resolvedImage = resolveAssetSource(optionValue);
          Config.setImage(moduleName + 'Image', resolvedImage);
        }
      });
    });
  }, [
    Config,
    apiKey,
    clientName,
    primaryColor,
    region,
    marketDomain,
    eventHeaderType,
    environment,
    prebuiltModules,
  ]);

  const setTicketDeepLink = useCallback(
    (id: string) => {
      Config.setConfig('orderIdDeepLink', id);
    },
    [Config]
  );

  useEffect(() => {
    const onConfigureAccountsSdk = async () => {
      setNativeConfigValues();
      try {
        await configureAccountsSDK();
      } catch (e) {
        console.log(`Accounts SDK error: ${(e as Error).message}`);
      }
    };
    onConfigureAccountsSdk();
    // Only run initial configuration once in an apps lifecycle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const igniteEventEmitter = new NativeEventEmitter(
      NativeModules.GlobalEventEmitter
    );
    igniteEventEmitter.addListener(
      'igniteAnalytics',
      async (result: IgniteAnalytics) => {
        if (result && analytics) analytics(result);
        if (
          ((result.purchaseSdkDidEndCheckoutFor ||
            result.ticketsSdkDidViewEvents) &&
            autoUpdate) ||
          // iOS TMAuthentication.shared.validToken() successful login
          (result.accountsSdkLoggedIn && !isLoggingIn && Platform.OS === 'ios')
        ) {
          await setAccountDetails();
        }
        if (result.ticketsSdkVenueConcessionsOrderFor) {
          venueConcessionsModule?.orderButtonCallback(
            result.ticketsSdkVenueConcessionsOrderFor
          );
        }
        if (result.ticketsSdkVenueConcessionsWalletFor) {
          venueConcessionsModule?.walletButtonCallback(
            result.ticketsSdkVenueConcessionsWalletFor
          );
        }
      }
    );

    // Removes the listener once unmounted
    return () => {
      igniteEventEmitter.removeAllListeners('igniteAnalytics');
    };
    // Only create native listener once in an apps lifecycle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(
    // eslint-disable-next-line prettier/prettier
    async ({ onLogin, skipUpdate }: LoginParams = { skipUpdate: false }): Promise<void> => {
      return new Promise<void>(async (resolve, reject) => {
        if (Platform.OS === 'ios') {
          !skipUpdate && setIsLoggingIn(true);
          try {
            const result = await AccountsSDK.login();
            if (result.accessToken) {
              console.log('Accounts SDK login successful');
              !skipUpdate && (await setAccountDetails());
              //avoid await on callbacks passed to library as there is no guarantee how long they will take to resolve
              onLogin && onLogin();
            }
            resolve();
          } catch (e) {
            !skipUpdate && setIsLoggingIn(false);
            reject(e);
          }
          !skipUpdate && setIsLoggingIn(false);
        } else if (Platform.OS === 'android') {
          !skipUpdate && setIsLoggingIn(true);
          setTimeout(() => {
            if (isLoggingIn && !skipUpdate) setIsLoggingIn(false);
          }, 8000);
          AccountsSDK.login(async (resultCode: any) => {
            if (resultCode === -1) {
              console.log('Accounts SDK login successful');
              !skipUpdate && (await setAccountDetails());
              onLogin && onLogin();
            }
            resolve();
            !skipUpdate && setIsLoggingIn(false);
          });
        }
      });
    },
    // isLoggingIn will update frequently, login() should not trigger/change on those updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [AccountsSDK, setAccountDetails]
  );

  const logout = useCallback(
    // eslint-disable-next-line prettier/prettier
    async ({ onLogout, skipUpdate }: LogoutParams = { skipUpdate: false }): Promise<void> => {
      try {
        await AccountsSDK.logout();
        console.log('Accounts SDK logout successful');
        !skipUpdate && (await setAccountDetails());
        onLogout && onLogout();
      } catch (e) {
        throw e;
      }
    },
    [AccountsSDK, setAccountDetails]
  );

  const logoutAll = useCallback(
    // eslint-disable-next-line prettier/prettier
    async ({ onLogout, skipUpdate }: LogoutParams = { skipUpdate: false }): Promise<void> => {
      try {
        Platform.OS === 'ios'
          ? await AccountsSDK.logoutAll()
          : await AccountsSDK.logout();
        console.log('Accounts SDK logoutAll successful');
        !skipUpdate && (await setAccountDetails());
        onLogout && onLogout();
      } catch (e) {
        throw e;
      }
    },
    [AccountsSDK, setAccountDetails]
  );

  const getIsLoggedIn = useCallback(async (): Promise<boolean> => {
    try {
      const result = await AccountsSDK.isLoggedIn();
      console.log(
        `Accounts SDK isLoggedIn: ${Platform.OS === 'ios' ? !!result.result : result}`
      );
      return Platform.OS === 'ios' ? !!result.result : result;
    } catch (e) {
      if ((e as Error).message.includes('User not logged in')) {
        console.log('Accounts SDK isLoggedIn: false');
        return false;
      } else {
        throw e;
      }
    }
  }, [AccountsSDK]);

  const getToken = useCallback(async (): Promise<AccessToken> => {
    let accessToken;
    try {
      if (Platform.OS === 'ios') {
        // iOS getToken has the exact same Native logic as refreshToken, but will not display the login UI if a user is not logged in or has an invalidated token
        const result = await AccountsSDK.getToken();
        accessToken = result.accessToken === '' ? null : result.accessToken;
      } else if (Platform.OS === 'android') {
        accessToken = await AccountsSDK.refreshToken();
      }
      console.log(`Accounts SDK access token: ${JSON.stringify(accessToken)}`);
      return accessToken;
    } catch (e) {
      if ((e as Error).message.includes('User not logged in')) {
        console.log('Accounts SDK access token: null');
        return null;
      } else {
        throw e;
      }
    }
  }, [AccountsSDK]);

  const getMemberInfo = useCallback(async () => {
    let result;
    try {
      result = await AccountsSDK.getMemberInfo();
      console.log(`Accounts SDK memberInfo: ${JSON.stringify(result)}`);
      return Platform.OS === 'ios' ? result : JSON.parse(result);
    } catch (e) {
      if ((e as Error).message.includes('User not logged in')) {
        console.log('Accounts SDK memberInfo: null');
        return null;
      } else {
        throw e;
      }
    }
  }, [AccountsSDK]);

  const refreshToken = useCallback(async (): Promise<AccessToken> => {
    try {
      const result = await AccountsSDK.refreshToken();
      if (Platform.OS === 'ios') {
        // login() is automatically triggered in the iOS Accounts SDK refreshToken() method by TMAuthentication.shared.validToken()
        console.log(
          `Accounts SDK access token: ${result.accessToken === '' ? null : result.accessToken}`
        );
        return result.accessToken === '' ? null : result.accessToken;
      } else {
        if (result === null) {
          await login();
          return await getToken();
        } else {
          console.log(`Accounts SDK access token: ${JSON.stringify(result)}`);
          return result;
        }
      }
    } catch (e) {
      if ((e as Error).message.includes('User not logged in')) {
        console.log('Accounts SDK refresh token: null');
        return null;
      } else {
        throw e;
      }
    }
  }, [AccountsSDK, getToken, login]);

  const refreshConfiguration = useCallback(
    // eslint-disable-next-line prettier/prettier, @typescript-eslint/no-shadow
    async ({ apiKey, clientName, primaryColor, environment, region, marketDomain, eventHeaderType, skipAutoLogin, skipUpdate, onSuccess, onLoginSuccess }: RefreshConfigParams = { apiKey: '', skipAutoLogin: false, skipUpdate: false, onLoginSuccess: () => {} }) => {
      try {
        Config.setConfig('apiKey', apiKey);
        clientName && Config.setConfig('clientName', clientName);
        primaryColor && Config.setConfig('primaryColor', primaryColor);
        region && Config.setConfig('region', region);
        marketDomain && Config.setConfig('marketDomain', marketDomain);
        eventHeaderType && Config.setConfig('eventHeaderType', eventHeaderType);
        if (
          environment === 'Production' ||
          environment === 'PreProduction' ||
          environment === 'Staging'
        )
          Config.setConfig('environment', environment);
        await configureAccountsSDK();
        onSuccess && onSuccess();
        !skipAutoLogin &&
          (await login({ onLogin: onLoginSuccess, skipUpdate }));
      } catch (e) {
        throw e;
      }
    },
    [Config, configureAccountsSDK, login]
  );

  return (
    <IgniteContext.Provider
      value={{
        login,
        logout,
        logoutAll,
        getIsLoggedIn,
        getToken,
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
