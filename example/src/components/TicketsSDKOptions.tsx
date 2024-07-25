import React, { useState } from 'react';
import { TicketsSdkModal } from 'react-native-ticketmaster-ignite';
import { Platform, View } from 'react-native';
import SDKButton from './SDKButton';
import SectionHeader from './SectionHeader';

const TicketsSDKOptions = () => {
  const [showTicketsSdk, setShowTicketsSdk] = useState(false);

  const onShowTicketsSDK = () => {
    setShowTicketsSdk(true);
  };

  const DATA = [
    {
      title: 'Tickets SDK (Modal)',
      platforms: ['ios'],
      onPress: () => onShowTicketsSDK(),
    },
  ];

  return (
    <View>
      <SectionHeader title="Tickets SDK" />
      {DATA.map((item) => {
        return (
          item.platforms.includes(Platform.OS) && (
            <SDKButton item={item} key={item.title} />
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

export default TicketsSDKOptions;
