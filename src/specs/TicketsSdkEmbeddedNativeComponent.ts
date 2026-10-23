import { codegenNativeComponent } from 'react-native';
import type { HostComponent, ViewProps } from 'react-native';
import type { CodegenTypes } from 'react-native';

export interface NativeProps extends ViewProps {
  offsetTop?: CodegenTypes.Double;
  deepLinkId?: string;
}

export default codegenNativeComponent<NativeProps>(
  'TicketsSdkEmbeddedView'
) as HostComponent<NativeProps>;
