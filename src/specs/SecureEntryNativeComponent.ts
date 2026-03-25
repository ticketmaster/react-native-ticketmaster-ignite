import { codegenNativeComponent } from 'react-native';
import type { HostComponent, ViewProps } from 'react-native';
import type { Double } from 'react-native/Libraries/Types/CodegenTypes';

export interface NativeProps extends ViewProps {
  token: string;
  offsetTop?: Double;
}

export default codegenNativeComponent<NativeProps>(
  'SecureEntryView'
) as HostComponent<NativeProps>;
