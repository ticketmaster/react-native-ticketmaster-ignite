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

type IgniteContextType = {
  login: (LoginParams?: LoginParams) => Promise<void>;
  logout: (LogoutParams?: LogoutParams) => Promise<void>;
  getIsLoggedIn: () => Promise<boolean>;
  getToken: () => Promise<string | null>;
  getMemberInfo: () => Promise<Record<string, any> | null>;
  refreshToken: () => Promise<string | null>;
  authState: AuthStateParams;
  isLoggingIn: boolean;
};

export const IgniteContext = createContext<IgniteContextType>({
  login: async () => {},
  logout: async () => {},
  getIsLoggedIn: async () => false,
  getToken: async () => null,
  getMemberInfo: async () => null,
  refreshToken: async () => null,
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
  const { apiKey, clientName, primaryColor } = options;

  Config.setConfig('apiKey', apiKey);
  Config.setConfig('clientName', clientName);
  Config.setConfig('primaryColor', primaryColor);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const configureAccountsSDK = async () => {
      try {
        const result = await AccountsSDK.configureAccountsSDK();
        console.log('Accounts SDK configuration set: ', result);
        autoUpdate && (await setAccountDetails());
      } catch (e) {
        console.log('Accounts SDK error:', (e as Error).message);
      }
    };
    configureAccountsSDK();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (
    { onLogin, skipUpdate }: LoginParams = {
      onLogin: () => {},
      skipUpdate: false,
    }
  ): Promise<void> => {
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
  };

  const logout = async (
    { onLogout, skipUpdate }: LogoutParams = {
      onLogout: () => {},
      skipUpdate: false,
    }
  ): Promise<void> => {
    try {
      await AccountsSDK.logout();
      console.log('Accounts SDK logout successful');
      onLogout && onLogout();
      !skipUpdate && (await setAccountDetails());
    } catch (e) {
      throw e;
    }
  };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getToken = useCallback(async (): Promise<string | null> => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshToken = useCallback(async (): Promise<string | null> => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IgniteContext.Provider
      value={{
        login,
        logout,
        getIsLoggedIn,
        getToken,
        getMemberInfo,
        refreshToken,
        authState,
        isLoggingIn,
      }}
    >
      {children}
    </IgniteContext.Provider>
  );
};
