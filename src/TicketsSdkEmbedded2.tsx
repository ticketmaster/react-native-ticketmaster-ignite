import React from 'react';
import { Platform, ViewStyle } from 'react-native';
// import { TicketsSdkEmbeddedIos } from './TicketsSdkEmbeddedIos';
import { TicketsSdkEmbeddedAndroid } from './TicketsSdkEmbeddedAndroid';

type TicketsSdkEmbeddedProps = {
  /**
   * Add offset to the top of the native UI component. Useful for temporary issues that exist with UI placement within React Navigation containers when React Native’s New Architecture is turned on.
   *
   * Android only.
   */
  offsetTop?: number;
  style?: ViewStyle;
  renderTimeDelay?: number | undefined;
};

export const TicketsSdkEmbedded = ({
  style,
  offsetTop,
  renderTimeDelay,
}: TicketsSdkEmbeddedProps) => {
  return (
    <>
      {Platform.OS === 'ios' ? (
        // <TicketsSdkEmbeddedIos
        //   style={style}
        //   renderTimeDelay={renderTimeDelay}
        // />
        <></>
      ) : (
        <TicketsSdkEmbeddedAndroid style={style} offsetTopProp={offsetTop} />
      )}
    </>
  );
};
