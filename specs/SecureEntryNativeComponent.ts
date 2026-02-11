import { codegenNativeComponent } from 'react-native';
import type { HostComponent, ViewProps } from 'react-native';

export interface NativeProps extends ViewProps {
  token: string;
}

export default codegenNativeComponent<NativeProps>(
  'SecureEntryView'
) as HostComponent<NativeProps>;
