import React, { useEffect } from 'react';
import { requireNativeComponent, View } from 'react-native';

const TicketsSdk = requireNativeComponent('RNTTicketsSdkView');

type TicketsSdkModalProps = {
  showTicketsModal: boolean;
  setShowTicketsModal: (arg0: boolean) => void;
};

export const TicketsSdkModal = ({
  showTicketsModal,
  setShowTicketsModal,
}: TicketsSdkModalProps) => {
  useEffect(() => {
    setShowTicketsModal(showTicketsModal);
    setTimeout(() => {
      setShowTicketsModal(false);
    }, 500);
  }, [showTicketsModal, setShowTicketsModal]);

  return (
    <>
      {showTicketsModal && (
        <View testID="ticketsSDKWrapper">
          <TicketsSdk />
        </View>
      )}
    </>
  );
};
