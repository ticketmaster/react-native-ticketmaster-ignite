import React, { useEffect, useState } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { requireNativeComponent, ViewProps } from 'react-native';

interface RNTSecureEntryViewProps extends ViewProps {
  token: string;
  style: ViewStyle;
}

type SecureEntryIosProps = {
  token: string;
  style?: ViewStyle;
  renderTimeDelay?: number | undefined;
};

const SecureEntryViewManager =
  requireNativeComponent<RNTSecureEntryViewProps>('RNTSecureEntryView');

export const SecureEntryIos = ({
  token,
  style,
  renderTimeDelay,
}: SecureEntryIosProps) => {
  const [initialFocus, setInitialFocus] = useState(true);

  useEffect(() => {
    // Initially, the altered Bottom Tabs View frame height is not available to Native code on iOS, this becomes available after a rerender.
    // If needed an additional delay can be used before setting to false
    setTimeout(() => setInitialFocus(false), renderTimeDelay || 0);
  }, [renderTimeDelay]);

  return (
    <>
      {!initialFocus && (
        <SecureEntryViewManager
          token={token}
          style={style || styles.container}
          testID="SecureEntrySdkIos"
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
