import React, { useEffect, useRef } from 'react';
import { Platform, StyleSheet, ViewStyle } from 'react-native';
import type { Double } from 'react-native/Libraries/Types/CodegenTypes';
import NativeAccountsSdk from './specs/NativeAccountsSdk';
import TicketsSdkEmbeddedNativeComponent from './specs/TicketsSdkEmbeddedNativeComponent';

type TicketsSdkEmbeddedViewProps = {
  /**
   * Add offset to the top of the native UI component. Useful for temporary issues that exist with UI placement within React Navigation containers when React Native's New Architecture is turned on.
   *
   * Android only.
   */
  offsetTop?: number;
  /**
   * Order or Event ID to deep link to a specific ticket.
   */
  deepLinkId?: string;
  /**
   * When false this prop will unmount the Tickets SDK when the tab/screen is not in focus and will remount the Tickets SDK
   * when the value comes true. Can be used if you want to get the most recent tickets data and state upon returning to the tab rendering Tickets SDK.
   * If no value is provided this prop's value remains true and the Tickets SDK will stay rendered.
   */
  isFocused?: boolean;
  style?: ViewStyle;
};

export const TicketsSdkEmbedded = ({
  style,
  offsetTop,
  deepLinkId,
  isFocused = true,
}: TicketsSdkEmbeddedViewProps) => {
  const previousIsFocusedRef = useRef<boolean | undefined>(undefined);

  // Track when isFocused transitions from false → true for iOS refresh
  useEffect(() => {
    if (
      Platform.OS === 'ios' &&
      previousIsFocusedRef.current === false &&
      isFocused === true
    ) {
      NativeAccountsSdk.notifyConfigurationRefreshed();
    }
    previousIsFocusedRef.current = isFocused;
  }, [isFocused]);

  if (!isFocused) {
    return null;
  }

  return (
    <TicketsSdkEmbeddedNativeComponent
      style={{ ...styles.ticketsSdkContainer, ...(style && style) }}
      offsetTop={offsetTop as Double}
      deepLinkId={deepLinkId}
    />
  );
};

const styles = StyleSheet.create({
  ticketsSdkContainer: { width: '100%', height: '100%' },
});
