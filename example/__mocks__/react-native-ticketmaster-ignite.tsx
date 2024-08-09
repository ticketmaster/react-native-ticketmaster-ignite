import { View, Text } from 'react-native';
import React from 'react';

export const useIgnite = jest.fn(() => ({
  logout: jest.fn(),
  login: jest.fn(),
  getToken: jest.fn(),
  getIsLoggedIn: jest.fn(),
  authState: jest.fn(),
  isLoggingIn: false,
}));

export const RetailSDK = {
  presentPurchase: jest.fn(),
  presentPrePurchaseVenue: jest.fn(),
  presentPrePurchaseAttraction: jest.fn(),
};

export const TicketsSdkEmbeddedIos = jest.fn(() => {
  return (
    <View>
      <Text>Hello Test</Text>
    </View>
  );
});

export const TicketsSdkEmbeddedAndroid = jest.fn(() => {
  return (
    <View>
      <Text>Hello Android</Text>
    </View>
  );
});

export const TicketsSdkModal = jest.fn(() => {
  return (
    <View>
      <Text>Hello Modal</Text>
    </View>
  );
});
