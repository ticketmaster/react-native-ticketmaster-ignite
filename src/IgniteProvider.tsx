import React, { createContext, useCallback, useEffect, useState } from 'react';
import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import { IgniteAnalytics } from 'react-native-ticketmaster-ignite';

interface IgniteProviderProps {
  children: React.ReactNode;
  autoUpdate?: boolean;
  analytics?: (data: IgniteAnalytics) => void | Promise<void>;
  options: {
    apiKey: string;
    clientName: string;
    primaryColor: string;
    region?: Region;
  };
}

type LoginParams = {
  onLogin?: () => void;
  skipUpdate?: boolean;
};

type LogoutParams = {
  onLogout?: () => void;
  skipUpdate?: boolean;
};

type AuthStateParams = {
  isConfigured: boolean;
  isLoggedIn: boolean;
  memberInfo: Record<string, any> | null;
};

type RefreshConfigParams = {
  apiKey: string;
  clientName?: string;
  primaryColor?: string;
  skipAutoLogin?: boolean;
  skipUpdate?: boolean;
  onSuccess?: () => void;
  onLoginSuccess?: () => void;
};

type IgniteContextType = {
  login: (LoginParams?: LoginParams) => Promise<void>;
  logout: (LogoutParams?: LogoutParams) => Promise<void>;
  getIsLoggedIn: () => Promise<boolean>;
  getToken: () => Promise<string | AuthSource | null>;
  getMemberInfo: () => Promise<Record<string, any> | null>;
  refreshToken: () => Promise<string | AuthSource | null>;
  refreshConfiguration: (
    RefreshConfigParams: RefreshConfigParams
  ) => Promise<void>;
  authState: AuthStateParams;
  isLoggingIn: boolean;
};

type Region = 'US' | 'UK';

type AuthSource = {
  hostAccessToken?: string;
  archticsAccessToken?: string;
  mfxAccessToken?: string;
  sportXRAccessToken?: string;
};

export const IgniteContext = createContext<IgniteContextType>({
  login: async () => {},
  logout: async () => {},
  getIsLoggedIn: async () => false,
  getToken: async () => null,
  getMemberInfo: async () => null,
  refreshToken: async () => null,
  refreshConfiguration: async () => {},
  authState: {
    isConfigured: false,
    isLoggedIn: false,
    memberInfo: null,
  },
  isLoggingIn: false,
});

export const IgniteProvider: React.FC<IgniteProviderProps> = ({
  children,
  options,
  autoUpdate = true,
  analytics,
}) => {
  const { Config, AccountsSDK } = NativeModules;
  const { apiKey, clientName, primaryColor, region } = options;
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

  useEffect(() => {
    Config.setConfig('apiKey', apiKey);
    Config.setConfig('clientName', clientName);
    Config.setConfig('primaryColor', primaryColor);
    Config.setConfig('region', region || 'US');

    const onConfigureAccountsSdk = async () => {
      try {
        await configureAccountsSDK();
      } catch (e) {
        console.log('Accounts SDK error:', (e as Error).message);
      }
    };
    onConfigureAccountsSdk();
    // Only run initial configuration once in an apps lifecycle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const igniteEventEmitter = new NativeEventEmitter(
      NativeModules.EventEmitter
    );
    igniteEventEmitter.addListener(
      'igniteAnalytics',
      async (result: IgniteAnalytics) => {
        if (result && analytics) analytics(result);
        if (result.purchaseSdkDidEndCheckoutFor && autoUpdate)
          await setAccountDetails();
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
              onLogin && onLogin();
              resolve();
            }
          } catch (e) {
            !skipUpdate && setIsLoggingIn(false);
            reject(e);
          }
          !skipUpdate && setIsLoggingIn(false);
        } else if (Platform.OS === 'android') {
          !skipUpdate && setIsLoggingIn(true);
          AccountsSDK.login(async (resultCode: any) => {
            if (resultCode === -1) {
              console.log('Accounts SDK Login successful');
              !skipUpdate && (await setAccountDetails());
              onLogin && onLogin();
              resolve();
            }
            !skipUpdate && setIsLoggingIn(false);
          });
          setTimeout(() => {
            if (isLoggingIn && !skipUpdate) setIsLoggingIn(false);
          }, 8000);
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

  const getIsLoggedIn = useCallback(async (): Promise<boolean> => {
    try {
      const result = await AccountsSDK.isLoggedIn();
      console.log(
        'Accounts SDK isLoggedIn:',
        Platform.OS === 'ios' ? !!result.result : result
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

  const getToken = useCallback(async (): Promise<
    string | AuthSource | null
  > => {
    let accessToken;
    try {
      if (Platform.OS === 'ios') {
        // iOS getToken has the exact same Native logic as refreshToken, but will not display the login UI if a user is not logged in or has an invalidated token
        const result = await AccountsSDK.getToken();
        accessToken = result.accessToken;
      } else if (Platform.OS === 'android') {
        accessToken = await AccountsSDK.refreshToken();
      }
      console.log('Accounts SDK access token:', accessToken);
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
      console.log(
        'Accounts SDK memberInfo:',
        Platform.OS === 'ios' ? result : JSON.parse(result)
      );
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

  const refreshToken = useCallback(async (): Promise<
    string | AuthSource | null
  > => {
    try {
      const result = await AccountsSDK.refreshToken();
      console.log('Accounts SDK refresh token:', result);
      return Platform.OS === 'ios' ? result.accessToken : result;
    } catch (e) {
      if ((e as Error).message.includes('User not logged in')) {
        console.log('Accounts SDK refresh token: null');
        return null;
      } else {
        throw e;
      }
    }
  }, [AccountsSDK]);

  const refreshConfiguration = useCallback(
    // eslint-disable-next-line prettier/prettier, @typescript-eslint/no-shadow
    async ({ apiKey, clientName, primaryColor, skipAutoLogin, skipUpdate, onSuccess, onLoginSuccess  }: RefreshConfigParams = { apiKey: '', skipAutoLogin: false, skipUpdate: false, onLoginSuccess: () => {},   }) => {
      try {
        Config.setConfig('apiKey', apiKey);
        clientName && Config.setConfig('clientName', clientName);
        primaryColor && Config.setConfig('primaryColor', primaryColor);
        await configureAccountsSDK();
        !skipAutoLogin && (await login({ onLogin: onLoginSuccess, skipUpdate }));
        onSuccess && onSuccess();
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
        getIsLoggedIn,
        getToken,
        getMemberInfo,
        refreshToken,
        refreshConfiguration,
        authState,
        isLoggingIn,
      }}
    >
      {children}
    </IgniteContext.Provider>
  );
};
