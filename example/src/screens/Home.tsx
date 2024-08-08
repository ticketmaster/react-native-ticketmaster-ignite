import React from 'react';
import { StyleSheet, View, ActivityIndicator, ScrollView } from 'react-native';
import { useIgnite } from 'react-native-ticketmaster-ignite';
import AccountsSdkOptions from '../components/AccountsSdkOptions';
import RetailSdkOptions from '../components/RetailSdkOptions';
import TicketsSdkOptions from '../components/TicketsSdkOptions';

const Home = () => {
  const { isLoggingIn } = useIgnite();

  return (
    <ScrollView>
      {!!isLoggingIn && (
        <View style={styles.activityIndicator}>
          <ActivityIndicator color={'blue'} size={'small'} />
        </View>
      )}
      <AccountsSdkOptions />
      <RetailSdkOptions />
      <TicketsSdkOptions />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  activityIndicator: {
    paddingTop: 12,
  },
});

export default Home;
