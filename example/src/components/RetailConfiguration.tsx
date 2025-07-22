import React from 'react';
import { View } from 'react-native';
import Config from 'react-native-config';
import SectionHeader from './SectionHeader';
import SectionTextInput from './SectionTextInput';
import SectionDropdown from './SectionDropdown';
import { marketDomain as marketDomainData } from '../data/sharedData';
import {
  EventHeaderType,
  MarketDomain,
} from 'react-native-ticketmaster-ignite';

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
        defaultValue={Config.DEMO_VENUE_ID || ''}
        value={VenueIdValue}
        onChangeText={onVenueIdTextChange}
        topRounded={true}
      />
      <SectionTextInput
        title="PrePurchase Attraction ID"
        placeholder="Enter PrePurchase Attraction ID"
        defaultValue={Config.DEMO_ATTRACTION_ID || ''}
        value={attractionIdValue}
        onChangeText={onAttractionIdTextChange}
      />
      <SectionTextInput
        title="Purchase ID"
        placeholder="Enter Purchase ID"
        defaultValue={Config.DEMO_EVENT_ID || ''}
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
