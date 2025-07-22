import React from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  ScrollView,
  Platform,
  Text,
} from 'react-native';
import { useIgnite } from 'react-native-ticketmaster-ignite';
import AccountsSdkOptions from '../components/AccountsSDKOptions';
import RetailSDKOptions from '../components/RetailSDKOptions';
import TicketsSDKOptions from '../components/TicketsSDKOptions';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabsParamList } from '../types/sharedTypes';
import AnalyticsOptions from '../components/AnalyticsOptions';

type HomeProps = NativeStackScreenProps<BottomTabsParamList, 'Home'>;

const Home = ({ route }: HomeProps) => {
  const { attractionId, eventId, venueId } = route.params;
  const {
    isLoggingIn,
    authState: { memberInfo, isLoggedIn, isConfigured },
  } = useIgnite();

  const email =
    Platform.OS === 'ios'
      ? memberInfo?.email
      : memberInfo?.hostMember
        ? memberInfo?.hostMember.email
        : memberInfo?.sportXRMember
          ? memberInfo?.sportXRMember.email
          : memberInfo?.archticsMember
            ? memberInfo?.archticsMember.email
            : memberInfo?.mfxMember
              ? memberInfo?.archticsMember.email
              : '';

  return (
    <ScrollView style={styles.scrollViewContainer}>
      <View style={styles.infoWrapper}>
        <Text numberOfLines={1} style={styles.infoText}>
          <Text style={styles.infoLabel}>
            Accounts SDK successfully configured:{' '}
          </Text>
          {`${isConfigured}`}
        </Text>
        {isLoggedIn && (
          <Text numberOfLines={1} style={styles.infoText}>
            <Text style={styles.infoLabel}>Logged in as: </Text>
            {email}
          </Text>
        )}
      </View>

      {!!isLoggingIn && (
        <View style={styles.activityIndicator}>
          <ActivityIndicator color={'blue'} size={'small'} />
        </View>
      )}
      <AccountsSdkOptions />
      <RetailSDKOptions
        attractionId={attractionId}
        eventId={eventId}
        venueId={venueId}
      />
      <TicketsSDKOptions />
      <AnalyticsOptions />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 30,
  },
  infoWrapper: {
    backgroundColor: '#ffffff',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: 40,
    paddingLeft: 10,
    borderRadius: 16,
  },
  infoText: { color: 'black', fontSize: 12, width: '100%' },
  infoLabel: { fontSize: 12, fontWeight: 'bold', color: 'black' },
  activityIndicator: {
    paddingTop: 12,
  },
});

export default Home;
