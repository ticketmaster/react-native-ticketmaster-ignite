import { codegenNativeComponent } from 'react-native';
import type { HostComponent, ViewProps } from 'react-native';
import type { CodegenTypes } from 'react-native';

export interface NativeProps extends ViewProps {
  token: string;
  offsetTop?: CodegenTypes.Double;
}

export default codegenNativeComponent<NativeProps>(
  'SecureEntryView'
) as HostComponent<NativeProps>;
