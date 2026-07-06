import React, { useContext } from 'react';
import { TicketsSdkModal } from 'react-native-ticketmaster-ignite';
import { Platform, View } from 'react-native';
import SdkButton from './SdkButton';
import SectionHeader from './SectionHeader';
import { AppContext } from '../../example/src/contexts/AppProvider';

const TicketsSdkOptions = (): React.ReactElement => {
  const { ticketDeepLinkId, setTicketDeepLinkId } = useContext(AppContext);

  const onShowTicketsSdk = (): void => {
    TicketsSdkModal?.showTicketsSdkModal(ticketDeepLinkId);
    setTicketDeepLinkId(undefined);
  };

  const DATA = [
    {
      title: 'Tickets SDK (Modal)',
      platforms: ['ios'],
      onPress: () => onShowTicketsSdk(),
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
            <SdkButton item={item} key={item.title} />
          )
        );
      })}
    </View>
  );
};

export default TicketsSdkOptions;
