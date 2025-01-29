import React from 'react';
import { Platform, ViewStyle, LayoutRectangle } from 'react-native';
import { SecureEntryIos } from './SecureEntryIos';
import { SecureEntryAndroid } from './SecureEntryAndroid';

type SecureEntryProps = {
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
  token: string;
  renderTimeDelay?: number | undefined;
};

export const SecureEntry = ({
  token,
  style,
  layout,
  renderTimeDelay,
}: SecureEntryProps) => {
  return (
    <>
      {Platform.OS === 'ios' ? (
        <SecureEntryIos
          token={token}
          style={style}
          renderTimeDelay={renderTimeDelay}
        />
      ) : (
        <SecureEntryAndroid token={token} style={style} layoutProp={layout} />
      )}
    </>
  );
};
