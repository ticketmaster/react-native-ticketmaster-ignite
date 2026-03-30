import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { TicketsSdkModal } from 'react-native-ticketmaster-ignite';

const TicketsSdkOptions = () => {
  return (
    <View>
      {Platform.OS === 'ios' && (
        <Pressable onPress={() => TicketsSdkModal?.showTicketsSdkModal()}>
          <Text>Tickets SDK (Modal)</Text>
        </Pressable>
      )}
    </View>
  );
};

export default TicketsSdkOptions;
