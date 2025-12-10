import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

type imageAsset = {
  uri: string;
  width: number;
  height: number;
  scale: number;
  fileSystemLocation?: string;
  httpServerLocation?: string;
  path?: string[];
  name?: string;
  type?: string;
  hash?: string;
};

export interface Spec extends TurboModule {
  setConfig(key: string, value: string): void;
  setImage(key: string, value: imageAsset): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeConfig');
