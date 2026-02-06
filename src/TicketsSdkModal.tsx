import React, { useEffect } from 'react';
import { View } from 'react-native';
import TicketsSdkModalNativeComponent from '../specs/TicketsSdkModalNativeComponent';

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
          <TicketsSdkModalNativeComponent />
        </View>
      )}
    </>
  );
};
