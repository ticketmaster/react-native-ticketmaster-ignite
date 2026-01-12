import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import { AccessToken, SportXrData } from '../src/types';

export interface Spec extends TurboModule {
  configureAccountsSDK(): Promise<void>;
  login(): Promise<{
    accessToken?: string;
    resultCode?: number;
  }>;
  logout(): Promise<void>;
  logoutAll(): Promise<void>;
  isLoggedIn(): Promise<boolean>;
  getMemberInfo(): Promise<Record<string, any>>;
  getToken(): Promise<AccessToken>;
  refreshToken(): Promise<AccessToken>;
  getSportXRData(): Promise<SportXrData>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeAccountsSdk');
