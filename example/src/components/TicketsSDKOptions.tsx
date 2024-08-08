import React, { useState } from 'react';
import { TicketsSdkModal } from 'react-native-ticketmaster-ignite';
import { Platform, View } from 'react-native';
import SdkButton from './SdkButton';
import SectionHeader from './SectionHeader';

const TicketsSdkOptions = () => {
  const [showTicketsSdk, setShowTicketsSdk] = useState(false);

  const onShowTicketsSDK = () => {
    setShowTicketsSdk(true);
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
      <SectionHeader title="Tickets SDK" />
      {DATA.map((item) => {
        return (
          item.platforms.includes(Platform.OS) && (
            <SdkButton item={item} key={item.title} />
          )
        );
      })}
      <TicketsSdkModal
        showTicketsModal={showTicketsSdk}
        setShowTicketsModal={setShowTicketsSdk}
      />
    </View>
  );
};

export default TicketsSdkOptions;
