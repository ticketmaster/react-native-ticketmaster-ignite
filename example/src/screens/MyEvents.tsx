import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useContext } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { TicketsSdkEmbedded } from 'react-native-ticketmaster-ignite';
import { AppContext } from '../contexts/AppProvider';

const MyEvents = () => {
  const isFocused = useIsFocused();
  const { ticketDeepLinkId, setTicketDeepLinkId } = useContext(AppContext);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setTicketDeepLinkId('');
      };
    }, [setTicketDeepLinkId])
  );

  return (
    <TicketsSdkEmbedded
      style={styles.ticketsContainer}
      offsetTop={0}
      deepLinkId={isFocused ? ticketDeepLinkId : ''}
      isFocused={isFocused}
    />
  );
};

const styles = StyleSheet.create({
  ticketsContainer: {
    height: Platform.OS === 'ios' ? '90%' : '95%',
    width: '100%',
  },
});

export default MyEvents;
