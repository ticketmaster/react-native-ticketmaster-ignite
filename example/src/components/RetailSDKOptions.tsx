import React from 'react';
import { RetailSDK } from 'react-native-ticketmaster-ignite';
import { View, Platform } from 'react-native';
import SDKButton from './SDKButton';
import SectionHeader from './SectionHeader';

type RetailSdkOptionsProps = {
  attractionId: string;
  eventId: string;
  venueId: string;
};

const RetailSDKOptions = ({
  attractionId,
  eventId,
  venueId,
}: RetailSdkOptionsProps) => {
  const onShowPurchase = async () => {
    try {
      RetailSDK.presentPurchase(eventId);
    } catch (e) {
      console.log('Retail SDK error - Purchase:', (e as Error).message);
    }
  };

  const onShowPrePurchaseVenue = async () => {
    try {
      RetailSDK.presentPrePurchaseVenue(venueId);
    } catch (e) {
      console.log(
        'Retail SDK error - PrePurchase venue:',
        (e as Error).message
      );
    }
  };

  const onShowPrePurchaseAttraction = async () => {
    try {
      RetailSDK.presentPrePurchaseAttraction(attractionId);
    } catch (e) {
      console.log(
        'Retail SDK error - PrePurchase attraction:',
        (e as Error).message
      );
    }
  };

  const DATA = [
    {
      title: 'PrePurchase Venue',
      platforms: ['ios', 'android'],
      onPress: () => onShowPrePurchaseVenue(),
      first: true,
    },
    {
      title: 'PrePurchase Attraction',
      platforms: ['ios', 'android'],
      onPress: () => onShowPrePurchaseAttraction(),
    },
    {
      title: 'Purchase',
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
