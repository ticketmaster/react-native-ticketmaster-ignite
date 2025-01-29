import React from 'react';
import { StyleSheet } from 'react-native';
import { TicketsSdkEmbedded } from 'react-native-ticketmaster-ignite';

const MyEvents = () => {
  return <TicketsSdkEmbedded style={styles.ticketsContainer} />;
};

const styles = StyleSheet.create({
  ticketsContainer: { height: '95%' },
});

export default MyEvents;
