import React from 'react';
import { Platform, ViewStyle, LayoutRectangle } from 'react-native';
import { SecureEntryIos } from './SecureEntryIos';
import { SecureEntryAndroid } from './SecureEntryAndroid';

type SecureEntryProps = {
  /**
   * Add offset to the top of the native UI component. Useful for temporary issues that exist with UI placement within React Navigation containers when React Native’s New Architecture is turned on.
   *
   * Android only.
   */
  offsetTop?: number;
  style?: ViewStyle;
  token: string;
  renderTimeDelay?: number | undefined;
};

export const SecureEntry = ({
  token,
  style,
  offsetTop,
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
        <SecureEntryAndroid
          token={token}
          style={style}
          offsetTopProp={offsetTop}
        />
      )}
    </>
  );
};
