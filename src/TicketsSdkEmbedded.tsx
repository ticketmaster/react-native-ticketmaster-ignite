import React from 'react';
import { Platform, ViewStyle, LayoutRectangle } from 'react-native';
import { TicketsSdkEmbeddedIos } from './TicketsSdkEmbeddedIos';
import { TicketsSdkEmbeddedAndroid } from './TicketsSdkEmbeddedAndroid';

type TicketsSdkEmbeddedProps = {
  /**
   * Manually position the layout of the Android UI component. Useful for temporary issues that exist with UI placement within React Navigation containers when React Native’s New Architecture is turned on.
   *
   * Android only.
   *
   * x - X position of native UI view.
   *
   * y - Y position of the native UI view. Y must be greater than 0 to trigger manual positioning.
   *
   * width - width of the Native UI view. Defaults to full width of parent view if 0 is sent.
   *
   * height - height of the native UI view. Defaults to full height of parent view if 0 is sent.
   */
  layout?: LayoutRectangle;
  style?: ViewStyle;
  renderTimeDelay?: number | undefined;
};

export const TicketsSdkEmbedded = ({
  style,
  layout,
  renderTimeDelay,
}: TicketsSdkEmbeddedProps) => {
  return (
    <>
      {Platform.OS === 'ios' ? (
        <TicketsSdkEmbeddedIos
          style={style}
          renderTimeDelay={renderTimeDelay}
        />
      ) : (
        <TicketsSdkEmbeddedAndroid style={style} layoutProp={layout} />
      )}
    </>
  );
};
