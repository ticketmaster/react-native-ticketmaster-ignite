import { requireNativeComponent, ViewProps } from 'react-native';

interface RNTTicketsSdkEmbeddedViewProps extends ViewProps {
  style: Record<string, any>;
}

export const TicketsSdkEmbeddedIos =
  requireNativeComponent<RNTTicketsSdkEmbeddedViewProps>(
    'RNTTicketsSdkEmbeddedView'
  );
