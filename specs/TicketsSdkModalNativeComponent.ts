import { codegenNativeComponent } from 'react-native';
import type { HostComponent, ViewProps } from 'react-native';

export interface NativeProps extends ViewProps {
  // No props
}

export default codegenNativeComponent<NativeProps>(
  'TicketsSdkModalView'
) as HostComponent<NativeProps>;
