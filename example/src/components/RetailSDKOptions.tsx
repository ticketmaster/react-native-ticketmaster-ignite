import React from 'react';
import { RetailSDK } from 'react-native-ticketmaster-ignite';
import { View, Platform } from 'react-native';
import Config from 'react-native-config';
import SdkButton from './SdkButton';
import SectionHeader from './SectionHeader';

const RetailSdkOptions = () => {
  const onShowPurchase = async () => {
    try {
      await RetailSDK.presentPurchase(Config.DEMO_EVENT_ID);
    } catch (e) {
      console.log('error when showing Purchase', (e as Error).message);
    }
  };

  const onShowPrePurchaseVenue = async () => {
    try {
      await RetailSDK.presentPrePurchaseVenue(Config.DEMO_VENUE_ID);
    } catch (e) {
      console.log('error when showing PrePurchase venue', (e as Error).message);
    }
  };

  const onShowPrePurchaseAttraction = async () => {
    try {
      await RetailSDK.presentPrePurchaseAttraction(Config.DEMO_ATTRACTION_ID);
    } catch (e) {
      console.log(
        'error when showing PrePurchase attraction',
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
            <SdkButton item={item} key={item.title} />
          )
        );
      })}
    </View>
  );
};

export default RetailSdkOptions;
