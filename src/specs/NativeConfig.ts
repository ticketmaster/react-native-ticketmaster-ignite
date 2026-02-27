import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  setConfig(key: string, value: string): void;
  setImage(key: string, uri: string): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeConfig');
