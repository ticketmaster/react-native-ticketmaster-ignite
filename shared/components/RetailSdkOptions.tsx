import React from 'react';
import { RetailSdk } from 'react-native-ticketmaster-ignite';
import { View, Platform } from 'react-native';
import SdkButton from './SdkButton';
import SectionHeader from './SectionHeader';

type RetailSdkOptionsProps = {
  attractionId: string;
  eventId: string;
  venueId: string;
};

const RetailSdkOptions = ({
  attractionId,
  eventId,
  venueId,
}: RetailSdkOptionsProps): React.ReactElement => {
  const onShowPurchase = async (): Promise<void> => {
    try {
      RetailSdk.presentPurchase(eventId);
    } catch (e) {
      console.log('Retail SDK error - Purchase:', (e as Error).message);
    }
  };

  const onShowPrePurchaseVenue = async (): Promise<void> => {
    try {
      RetailSdk.presentPrePurchaseVenue(venueId);
    } catch (e) {
      console.log(
        'Retail SDK error - PrePurchase venue:',
        (e as Error).message
      );
    }
  };

  const onShowPrePurchaseAttraction = async (): Promise<void> => {
    try {
      RetailSdk.presentPrePurchaseAttraction(attractionId);
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
            <SdkButton item={item} key={item.title} />
          )
        );
      })}
    </View>
  );
};

export default RetailSdkOptions;
