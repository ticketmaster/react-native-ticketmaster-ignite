import { useIsFocused } from 'expo-router';
import { useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { TicketsSdkEmbedded } from 'react-native-ticketmaster-ignite';
import { AppContext, type AppContextType } from '@shared/contexts/AppContext';

export default function TabThreeScreen() {
  const isFocused = useIsFocused();
  const { ticketDeepLinkId, setTicketDeepLinkId } = useContext(
    AppContext
  ) as AppContextType;

  useEffect(() => {
    return () => {
      setTicketDeepLinkId('');
    };
  }, [setTicketDeepLinkId]);

  return (
    <TicketsSdkEmbedded
      style={styles.ticketsContainer}
      offsetTop={0}
      deepLinkId={isFocused ? ticketDeepLinkId : ''}
      isFocused={isFocused}
    />
  );
}

const styles = StyleSheet.create({
  ticketsContainer: {
    height: '100%',
    width: '100%',
  },
});
