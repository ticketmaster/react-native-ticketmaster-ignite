import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

// TODO add the correct return types for getToken, getMemberInfo etc.
// In Android Accounts SDK module confirm all analytic key and value names are correct
export interface AccountsSdkSpec extends TurboModule {
  login(): Promise<void>;
  logout(): Promise<void>;
  logoutAll(): Promise<void>;
  isLoggedIn(): Promise<boolean>;
  getToken(): Promise<void>;
  getMemberInfo(): Promise<void>;
  refreshToken(): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<AccountsSdkSpec>('AccountsSdk');
