import React from 'react';
import { TicketsSdkModal } from 'react-native-ticketmaster-ignite';
import { Platform, View } from 'react-native';
import SDKButton from './SDKButton';
import SectionHeader from './SectionHeader';

const TicketsSDKOptions = () => {
  const onShowTicketsSDK = () => {
    TicketsSdkModal.showTicketsSdkModal();
  };

  const DATA = [
    {
      title: 'Tickets SDK (Modal)',
      platforms: ['ios'],
      onPress: () => onShowTicketsSDK(),
      first: true,
      last: true,
    },
  ];

  return (
    <View>
      {Platform.OS === 'ios' && <SectionHeader title="Tickets SDK" />}
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

export default TicketsSDKOptions;
