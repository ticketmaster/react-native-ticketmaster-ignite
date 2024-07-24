import React from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {
  useIgnite,
} from 'react-native-ticketmaster-ignite';
import AccountsSDKOptions from '../components/AccountsSDKOptions';
import RetailSDKOptions from '../components/RetailSDKOptions';
import TicketsSDKOptions from '../components/TicketsSDKOptions';

const Home = () => {

  const {
    isLoggingIn,
  } = useIgnite();

  return (
    <ScrollView>
      {!!isLoggingIn && (
        <View style={styles.activityIndicator}>
          <ActivityIndicator color={'blue'} size={'small'} />
        </View>
      )}
      <AccountsSDKOptions />
      <RetailSDKOptions />
      <TicketsSDKOptions />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  activityIndicator: {
    paddingTop: 12,
  },
});

export default Home;
