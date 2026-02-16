import React from 'react';
import { ViewStyle } from 'react-native';
import type { Double } from 'react-native/Libraries/Types/CodegenTypes';
import SecureEntryNativeComponent from '../specs/SecureEntryNativeComponent';

type SecureEntryProps = {
  token: string;
  /**
   * Add offset to the top of the native UI component. Useful for temporary issues that exist with UI placement within React Navigation containers when React Native's New Architecture is turned on.
   *
   * Android only.
   */
  offsetTop?: number;
  style?: ViewStyle;
};

export const SecureEntry = ({ token, style, offsetTop }: SecureEntryProps) => {
  return (
    <SecureEntryNativeComponent
      token={token}
      style={style || { width: '100%', height: '100%' }}
      offsetTop={offsetTop as Double}
    />
  );
};
