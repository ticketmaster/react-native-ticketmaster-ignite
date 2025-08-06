import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { TicketsSdkEmbedded } from 'react-native-ticketmaster-ignite';

const MyEvents = () => {
  const isFocused = useIsFocused();

  if (!isFocused) {
    return null;
  }

  return <TicketsSdkEmbedded style={styles.ticketsContainer} />;
};

const styles = StyleSheet.create({
  ticketsContainer: { height: Platform.OS === 'ios' ? '90%' : '95%' },
});

export default MyEvents;
