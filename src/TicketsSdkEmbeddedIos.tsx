import React, { useEffect, useState } from 'react';
import { ViewStyle } from 'react-native';
import { requireNativeComponent, ViewProps } from 'react-native';

interface RNTTicketsSdkEmbeddedViewProps extends ViewProps {
  style: ViewStyle;
}

type TicketsSdkEmbeddedIosProps = {
  style?: ViewStyle;
  renderTimeDelay?: number | undefined;
};

const TicketsSdk = requireNativeComponent<RNTTicketsSdkEmbeddedViewProps>(
  'RNTTicketsSdkEmbeddedView'
);

export const TicketsSdkEmbeddedIos = ({
  style,
  renderTimeDelay,
}: TicketsSdkEmbeddedIosProps) => {
  const [initialFocus, setInitialFocus] = useState(true);

  useEffect(() => {
    // Initially, the altered Bottom Tabs View frame height is not available to Native code on iOS, this becomes available after a rerender.
    // If needed an additional delay can be used before setting to false
    setTimeout(() => setInitialFocus(false), renderTimeDelay || 0);
  }, [renderTimeDelay]);

  return <>{!initialFocus && <TicketsSdk testID="TicketsSdk" style={style || { flex: 1 }} />}</>;
};
