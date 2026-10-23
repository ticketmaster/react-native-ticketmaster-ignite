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
  // Literal types are kept on purpose: the library's `style` prop is typed against the
  // monorepo root's react-native 0.81 types, whose DimensionValue has no plain `string`.
  ticketsContainer: {
    height: '100%' as const,
    width: '100%' as const,
  },
});
