import React from 'react';
import { ImageBackground, Platform, StyleSheet } from 'react-native';
import Config from 'react-native-config';
import { SecureEntry } from 'react-native-ticketmaster-ignite';

const SecureEntryView = () => {
  return (
    <ImageBackground
      style={styles.imageBackgroundContainer}
      resizeMode="cover"
      source={require('../../assets/react_background.png')}
    >
      <SecureEntry
        style={styles.barcode}
        token={Config.SECURE_ENTRY_TOKEN || ''}
        renderTimeDelay={100}
      />
    </ImageBackground>
  );
};

export default SecureEntryView;

const styles = StyleSheet.create({
  imageBackgroundContainer: {
    flex: 1,
  },
  barcode: {
    top: Platform.OS === 'ios' ? 230 : 270,
    height: 300,
    width: Platform.OS === 'ios' ? 300 : 350,
    alignSelf: 'center',
  },
});
