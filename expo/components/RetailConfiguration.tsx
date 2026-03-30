import React from 'react';
import { View } from 'react-native';
import {
  EventHeaderType,
  MarketDomain,
} from 'react-native-ticketmaster-ignite';
import { marketDomain as marketDomainData } from '@shared/data/sharedData';
import SectionDropdown from '@shared/components/SectionDropdown';
import SectionHeader from '@shared/components/SectionHeader';
import SectionTextInput from '@shared/components/SectionTextInput';

type RetailConfigurationProps = {
  marketDomain: string;
  eventHeaderType: string;
  VenueIdValue: string;
  attractionIdValue: string;
  eventIdValue: string;
  setMarketDomain: (arg0: MarketDomain) => void;
  setEventHeaderType: (arg0: EventHeaderType) => void;
  onVenueIdTextChange: (arg0: string) => void;
  onAttractionIdTextChange: (arg0: string) => void;
  onEventIdTextChange: (arg0: string) => void;
};

const RetailConfiguration = ({
  marketDomain,
  eventHeaderType,
  VenueIdValue,
  attractionIdValue,
  eventIdValue,
  setMarketDomain,
  setEventHeaderType,
  onVenueIdTextChange,
  onAttractionIdTextChange,
  onEventIdTextChange,
}: RetailConfigurationProps) => {
  return (
    <View>
      <SectionHeader title="Retail SDK" />
      <SectionTextInput
        title="PrePurchase Venue ID"
        placeholder="Enter PrePurchase Venue ID"
        defaultValue={process.env.EXPO_PUBLIC_DEMO_VENUE_ID || ''}
        value={VenueIdValue}
        onChangeText={onVenueIdTextChange}
        topRounded={true}
      />
      <SectionTextInput
        title="PrePurchase Attraction ID"
        placeholder="Enter PrePurchase Attraction ID"
        defaultValue={process.env.EXPO_PUBLIC_DEMO_ATTRACTION_ID || ''}
        value={attractionIdValue}
        onChangeText={onAttractionIdTextChange}
      />
      <SectionTextInput
        title="Purchase Event ID"
        placeholder="Enter Purchase Event ID"
        defaultValue={process.env.EXPO_PUBLIC_DEMO_EVENT_ID || ''}
        value={eventIdValue}
        onChangeText={onEventIdTextChange}
      />
      <SectionDropdown
        title={'Market Domain'}
        defaultValue={marketDomain}
        data={marketDomainData}
        onSelect={(value) => setMarketDomain(value as MarketDomain)}
      />
      <SectionDropdown
        title={'Retail SDK header type'}
        defaultValue={eventHeaderType}
        data={['NO_TOOLBARS', 'EVENT_INFO', 'EVENT_SHARE', 'EVENT_INFO_SHARE']}
        onSelect={(value) => setEventHeaderType(value as EventHeaderType)}
        bottomRounded={true}
      />
    </View>
  );
};

export default RetailConfiguration;
