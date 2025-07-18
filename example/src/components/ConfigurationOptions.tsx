import React from 'react';
import { View } from 'react-native';
import Config from 'react-native-config';
import SectionHeader from './SectionHeader';
import SectionTextInput from './SectionTextInput';
import SectionDropdown from './SectionDropdown';
import { Region } from 'react-native-ticketmaster-ignite';

type ConfigurationOptionsProps = {
  apiKeyValue: string;
  primaryColorValue: string;
  clientNameValue: string;
  onApiKeyTextChange: (arg0: string) => void;
  onPrimaryColorTextChange: (arg0: string) => void;
  onClientNameTextChange: (arg0: string) => void;
  setEnvironment: (arg0: string) => void;
  setRegion: (arg0: Region) => void;
};

const ConfigurationOptions = ({
  apiKeyValue,
  primaryColorValue,
  clientNameValue,
  onApiKeyTextChange,
  onPrimaryColorTextChange,
  onClientNameTextChange,
  setEnvironment,
  setRegion,
}: ConfigurationOptionsProps) => {
  return (
    <View>
      <SectionHeader title="Configuration" />
      <SectionTextInput
        title="Developer API Key"
        placeholder="Enter your developer API key"
        defaultValue={Config.API_KEY || ''}
        value={apiKeyValue}
        onChangeText={onApiKeyTextChange}
        topRounded={true}
      />

      <SectionDropdown
        title={'Environment'}
        data={['Production', 'PreProduction']}
        defaultValue={'Production'}
        onSelect={setEnvironment}
      />
      <SectionDropdown
        title={'Region'}
        defaultValue="US"
        data={['US', 'UK']}
        onSelect={setRegion as (arg0: string) => void}
      />
      <SectionTextInput
        title="Primary Color"
        placeholder="Enter primary color"
        defaultValue={Config.PRIMARY_COLOR || ''}
        value={primaryColorValue}
        onChangeText={onPrimaryColorTextChange}
      />
      <SectionTextInput
        title="Client Name"
        placeholder="Enter client name"
        defaultValue={Config.CLIENT_NAME || ''}
        value={clientNameValue}
        onChangeText={onClientNameTextChange}
        bottomRounded={true}
      />
    </View>
  );
};

export default ConfigurationOptions;
