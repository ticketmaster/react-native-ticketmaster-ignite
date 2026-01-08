import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

type imageAsset = {
  uri: string;
  width: number;
  height: number;
  scale: number;
};

export interface Spec extends TurboModule {
  setConfig(key: string, value: string): void;
  setImage(key: string, value: imageAsset): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeConfig');
