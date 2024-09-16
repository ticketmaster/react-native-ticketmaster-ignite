import React from 'react';
import Config from 'react-native-config';
import { SecureEntryAndroid } from 'react-native-ticketmaster-ignite';

const SecureEntryView = () => (
  <SecureEntryAndroid token={Config.SECURE_ENTRY_TOKEN || ''} />
);

export default SecureEntryView;
