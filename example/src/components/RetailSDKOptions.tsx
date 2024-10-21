import React from 'react';
import { RetailSDK } from 'react-native-ticketmaster-ignite';
import { View, Platform } from 'react-native';
import Config from 'react-native-config';
import SDKButton from './SDKButton';
import SectionHeader from './SectionHeader';

const RetailSDKOptions = () => {
  const onShowPurchase = async () => {
    try {
      RetailSDK.presentPurchase(Config.DEMO_EVENT_ID);
    } catch (e) {
      console.log('Retail SDK error - Purchase:', (e as Error).message);
    }
  };

  const onShowPrePurchaseVenue = async () => {
    try {
      RetailSDK.presentPrePurchaseVenue(Config.DEMO_VENUE_ID);
    } catch (e) {
      console.log(
        'Retail SDK error - PrePurchase venue:',
        (e as Error).message
      );
    }
  };

  const onShowPrePurchaseAttraction = async () => {
    try {
      RetailSDK.presentPrePurchaseAttraction(Config.DEMO_ATTRACTION_ID);
    } catch (e) {
      console.log(
        'Retail SDK error - PrePurchase attraction:',
        (e as Error).message
      );
    }
  };

  const DATA = [
    {
      title: 'Show Retail PrePurchase Venue',
      platforms: ['ios', 'android'],
      onPress: () => onShowPrePurchaseVenue(),
      first: true,
    },
    {
      title: 'Show Retail PrePurchase Attraction',
      platforms: ['ios', 'android'],
      onPress: () => onShowPrePurchaseAttraction(),
    },
    {
      title: 'Show Retail Purchase',
      platforms: ['ios', 'android'],
      onPress: () => onShowPurchase(),
      last: true,
    },
  ];

  return (
    <View>
      <SectionHeader title="Retail SDK" />
      {DATA.map((item) => {
        return (
          item.platforms.includes(Platform.OS) && (
            <SDKButton item={item} key={item.title} />
          )
        );
      })}
    </View>
  );
};

export default RetailSDKOptions;
