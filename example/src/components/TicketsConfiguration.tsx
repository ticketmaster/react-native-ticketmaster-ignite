import React from 'react';
import { StyleSheet, View } from 'react-native';
import SectionHeader from './SectionHeader';
import SectionTextInput from './SectionTextInput';

type TicketsConfigurationProps = {
  ticketDeeplink: string;
  onTicketDeepLinkTextChange: (arg0: string) => void;
};

const TicketsConfiguration = ({
  ticketDeeplink,
  onTicketDeepLinkTextChange,
}: TicketsConfigurationProps) => {
  return (
    <View style={styles.wrapper}>
      <SectionHeader title="Tickets SDK" />
      <SectionTextInput
        title="Ticket Deeplink"
        placeholder="Enter a Order or Event ID"
        value={ticketDeeplink}
        defaultValue=""
        onChangeText={onTicketDeepLinkTextChange}
        topRounded={true}
        bottomRounded={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 50 },
});

export default TicketsConfiguration;
