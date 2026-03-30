import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { RetailSdk } from 'react-native-ticketmaster-ignite';

interface RetailSdkOptionsProps {
  venueId: string;
  attractionId: string;
  eventId: string;
}

const RetailSdkOptions = ({
  venueId,
  attractionId,
  eventId,
}: RetailSdkOptionsProps) => {
  return (
    <View>
      <Pressable onPress={() => RetailSdk.presentPrePurchaseVenue(venueId)}>
        <Text>PrePurchase Venue</Text>
      </Pressable>
      <Pressable
        onPress={() => RetailSdk.presentPrePurchaseAttraction(attractionId)}
      >
        <Text>PrePurchase Attraction</Text>
      </Pressable>
      <Pressable onPress={() => RetailSdk.presentPurchase(eventId)}>
        <Text>Purchase</Text>
      </Pressable>
    </View>
  );
};

export default RetailSdkOptions;
