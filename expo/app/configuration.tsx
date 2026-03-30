import { router } from 'expo-router';
import React, { useContext, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  EventHeaderType,
  MarketDomain,
  Region,
  useIgnite,
} from 'react-native-ticketmaster-ignite';
import ConfigurationOptions from '../components/ConfigurationOptions';
import RetailConfiguration from '../components/RetailConfiguration';
import TicketsConfiguration from '@shared/components/TicketsConfiguration';
import { AppContext } from '../contexts/AppProvider';

export default function ConfigurationScreen() {
  const { refreshConfiguration, setTicketDeepLink } = useIgnite();
  const { primaryColor, setPrimaryColor } = useContext(AppContext);
  const [apiKeyValue, onApiKeyTextChange] = useState(
    process.env.EXPO_PUBLIC_API_KEY || ''
  );
  const [primaryColorValue, onPrimaryColorTextChange] =
    useState<string>(primaryColor);
  const [clientNameValue, onClientNameTextChange] = useState<string>(
    process.env.EXPO_PUBLIC_CLIENT_NAME || ''
  );
  const [environmentValue, setEnvironment] = useState<string>('Production');
  const [regionValue, setRegion] = useState<Region>('US');

  const [VenueIdValue, onVenueIdTextChange] = useState(
    process.env.EXPO_PUBLIC_DEMO_VENUE_ID || ''
  );
  const [attractionIdValue, onAttractionIdTextChange] = useState(
    process.env.EXPO_PUBLIC_DEMO_ATTRACTION_ID || ''
  );
  const [eventIdValue, onEventIdTextChange] = useState(
    process.env.EXPO_PUBLIC_DEMO_EVENT_ID || ''
  );
  const [marketDomainValue, setMarketDomain] = useState<MarketDomain>('US');
  const [eventHeaderTypeValue, setEventHeaderType] =
    useState<EventHeaderType>('EVENT_INFO_SHARE');
  const [ticketDeeplink, onTicketDeepLinkTextChange] = useState('');

  const onConfigure = async () => {
    try {
      await refreshConfiguration({
        apiKey: apiKeyValue,
        primaryColor: primaryColorValue,
        clientName: clientNameValue,
        environment: environmentValue,
        region: regionValue,
        marketDomain: marketDomainValue,
        eventHeaderType: eventHeaderTypeValue,
        skipAutoLogin: true,
      });
      setPrimaryColor(primaryColorValue);
      ticketDeeplink && setTicketDeepLink(ticketDeeplink);
      router.push({
        pathname: '/(tabs)',
        params: {
          venueId: VenueIdValue,
          attractionId: attractionIdValue,
          eventId: eventIdValue,
        },
      });
    } catch (e) {
      console.log(
        'Accounts SDK refreshConfiguration error',
        (e as Error).message
      );
      setPrimaryColor(primaryColorValue);
      ticketDeeplink && setTicketDeepLink(ticketDeeplink);
      router.push({
        pathname: '/(tabs)',
        params: {
          venueId: VenueIdValue,
          attractionId: attractionIdValue,
          eventId: eventIdValue,
        },
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ScrollView style={[styles.container]}>
        <ConfigurationOptions
          apiKeyValue={apiKeyValue}
          primaryColorValue={primaryColorValue}
          clientNameValue={clientNameValue}
          onApiKeyTextChange={onApiKeyTextChange}
          onPrimaryColorTextChange={onPrimaryColorTextChange}
          onClientNameTextChange={onClientNameTextChange}
          setEnvironment={setEnvironment}
          setRegion={setRegion}
        />
        <RetailConfiguration
          marketDomain={marketDomainValue}
          eventHeaderType={eventHeaderTypeValue}
          VenueIdValue={VenueIdValue}
          attractionIdValue={attractionIdValue}
          eventIdValue={eventIdValue}
          setMarketDomain={setMarketDomain}
          setEventHeaderType={setEventHeaderType}
          onVenueIdTextChange={onVenueIdTextChange}
          onAttractionIdTextChange={onAttractionIdTextChange}
          onEventIdTextChange={onEventIdTextChange}
        />
        <TicketsConfiguration
          ticketDeeplink={ticketDeeplink}
          onTicketDeepLinkTextChange={onTicketDeepLinkTextChange}
        />
      </ScrollView>
      <Pressable
        style={({ pressed }) => [
          {
            ...styles.button,
            backgroundColor: pressed ? '#2a7eb6ff' : '#3498db',
          },
        ]}
        onPress={onConfigure}
      >
        <Text style={styles.buttonText}>Done</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    width: '60%',
    height: 40,
    padding: 5,
    alignSelf: 'center',
    justifyContent: 'center',
    bottom: 20,
    borderRadius: 6,
  },
  buttonText: { color: '#ffffff', fontSize: 20, alignSelf: 'center' },
});
