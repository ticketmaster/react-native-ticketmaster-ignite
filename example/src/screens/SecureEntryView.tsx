import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Config from 'react-native-config';
import { SecureEntry } from 'react-native-ticketmaster-ignite';

const SecureEntryView = () => {
  return (
    <View style={styles.imageBackgroundContainer}>
      <Image
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        source={require('../../assets/react_background.png')}
      />
      <SecureEntry
        style={styles.barcode}
        token={Config.SECURE_ENTRY_TOKEN || ''}
      />
    </View>
  );
};

export default SecureEntryView;

const styles = StyleSheet.create({
  imageBackgroundContainer: {
    flex: 1,
  },
  barcode: {
    top: '30%',
    height: 300,
    width: '70%',
    alignSelf: 'center',
  },
});
