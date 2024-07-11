import React, { createContext, useEffect, useState } from 'react';
import { NativeModules, Platform } from 'react-native';

interface IgniteProviderProps {
  children: React.ReactNode;
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

type IgniteContextType = {
  login: (LoginParams?: LoginParams) => Promise<void>;
  logout: (LogoutParams?: LogoutParams) => Promise<void>;
  getIsLoggedIn: () => Promise<boolean>;
  getToken: () => Promise<string | null>;
  getMemberInfo: () => Promise<Record<string, any> | null>;
  refreshToken: () => Promise<string | null>;
  isLoggedIn: boolean;
  isLoggingIn: boolean;
  memberInfo: Record<string, any> | null;
  isConfigured: boolean;
};

export const IgniteContext = createContext<IgniteContextType>({
  login: async () => {},
  logout: async () => {},
  getIsLoggedIn: async () => false,
  getToken: async () => null,
  getMemberInfo: async () => null,
  refreshToken: async () => null,
  isLoggedIn: false,
  isLoggingIn: false,
  memberInfo: null,
  isConfigured: false,
});

export const IgniteProvider: React.FC<IgniteProviderProps> = ({
  children,
  options,
}) => {
  const { Config, AccountsSDK } = NativeModules;
  const { apiKey, clientName, primaryColor } = options;
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [memberInfo, setMemberInfo] = useState<Record<string, any> | null>(
    null
  );

  Config.setConfig('apiKey', apiKey);
  Config.setConfig('clientName', clientName);
  Config.setConfig('primaryColor', primaryColor);

  const setAccountDetails = async () => {
    try {
      const isLoggedInResult = await AccountsSDK.isLoggedIn();
      const memberInfoResult = await AccountsSDK.getMemberInfo();
      Platform.OS === 'ios'
        ? setIsLoggedIn(isLoggedInResult.result)
        : setIsLoggedIn(isLoggedInResult);

      const memberInfoParsed =
        Platform.OS === 'ios' ? memberInfoResult : JSON.parse(memberInfoResult);
      setMemberInfo(memberInfoParsed);
    } catch (e) {
      if ((e as Error).message.includes('User not logged in')) {
        setIsLoggedIn(false);
        setMemberInfo(null);
      } else {
        throw e;
      }
    }
  };

  useEffect(() => {
    const configureAccountsSDK = async () => {
      try {
        const result = await AccountsSDK.configureAccountsSDK();
        console.log('Accounts SDK configuration set: ', result);
        await setAccountDetails();
        setIsConfigured(true);
      } catch (e) {
        console.log('Accounts SDK configuration error:', (e as Error).message);
      }
    };
    configureAccountsSDK();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAuthenticated !== null) {
      const setAuth = async () => {
        await setAccountDetails();
      };
      setAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

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
            !skipUpdate && setIsAuthenticated(true);
            onLogin && onLogin();
            resolve();
          }
        } catch (e) {
          reject(e);
        }
        !skipUpdate && setIsLoggingIn(false);
      } else if (Platform.OS === 'android') {
        !skipUpdate && setIsLoggingIn(true);
        AccountsSDK.login((resultCode: any) => {
          console.log('Accounts SDK Login successful');
          if (resultCode === -1) {
            !skipUpdate && setIsAuthenticated(true);
            onLogin && onLogin();
            resolve();
          }
          !skipUpdate && setIsLoggingIn(false);
        });
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
      !skipUpdate && setIsAuthenticated(false);
    } catch (e) {
      throw e;
    }
  };

  const getIsLoggedIn = async (): Promise<boolean> => {
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
  };

  const getToken = async (): Promise<string | null> => {
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
  };

  const getMemberInfo = async () => {
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
  };

  const refreshToken = async (): Promise<string | null> => {
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
  };

  return (
    <IgniteContext.Provider
      value={{
        login,
        logout,
        getIsLoggedIn,
        getToken,
        getMemberInfo,
        refreshToken,
        isLoggedIn,
        isLoggingIn,
        memberInfo,
        isConfigured,
      }}
    >
      {children}
    </IgniteContext.Provider>
  );
};
