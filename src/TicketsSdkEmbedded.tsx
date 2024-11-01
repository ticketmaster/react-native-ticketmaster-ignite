import React from 'react';
import { Platform, ViewStyle } from 'react-native';
import { TicketsSdkEmbeddedIos } from './TicketsSdkEmbeddedIos';
import { TicketsSdkEmbeddedAndroid } from './TicketsSdkEmbeddedAndroid';

type TicketsSdkEmbeddedProps = {
  style?: ViewStyle;
  renderTimeDelay?: number | undefined;
};

export const TicketsSdkEmbedded = ({
  style,
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
        <TicketsSdkEmbeddedAndroid style={style} />
      )}
    </>
  );
};
