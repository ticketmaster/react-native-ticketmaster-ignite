import React from 'react';
import { Platform, ViewStyle } from 'react-native';
import { SecureEntryIos } from './SecureEntryIos';
import { SecureEntryAndroid } from './SecureEntryAndroid';

type SecureEntryProps = {
  token: string;
  style?: ViewStyle;
  renderTimeDelay?: number | undefined;
};

export const SecureEntry = ({
  token,
  style,
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
        <SecureEntryAndroid token={token} style={style} />
      )}
    </>
  );
};
