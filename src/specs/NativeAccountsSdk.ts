import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import { AccessToken, MemberInfo, SportXrData } from '../types';

export interface Spec extends TurboModule {
  configureAccountsSDK(): Promise<void>;
  login(): Promise<{
    accessToken?: string;
  }>;
  logout(): Promise<void>;
  logoutAll(): Promise<void>;
  isLoggedIn(): Promise<boolean>;
  getMemberInfo(): Promise<MemberInfo>;
  getToken(): Promise<AccessToken>;
  refreshToken(): Promise<AccessToken>;
  getSportXRData(): Promise<SportXrData>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeAccountsSdk');
