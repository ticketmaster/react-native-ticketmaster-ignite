import React from 'react';
import { View } from 'react-native';
import { Region } from 'react-native-ticketmaster-ignite';
import SectionDropdown from '@shared/components/SectionDropdown';
import SectionHeader from '@shared/components/SectionHeader';
import SectionTextInput from '@shared/components/SectionTextInput';

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
        defaultValue={process.env.EXPO_PUBLIC_API_KEY || ''}
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
        defaultValue={process.env.EXPO_PUBLIC_PRIMARY_COLOR || ''}
        value={primaryColorValue}
        onChangeText={onPrimaryColorTextChange}
      />
      <SectionTextInput
        title="Client Name"
        placeholder="Enter client name"
        defaultValue={process.env.EXPO_PUBLIC_CLIENT_NAME || ''}
        value={clientNameValue}
        onChangeText={onClientNameTextChange}
        bottomRounded={true}
      />
    </View>
  );
};

export default ConfigurationOptions;
