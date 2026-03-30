import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { SecureEntry } from 'react-native-ticketmaster-ignite';

export default function SecureEntryView(): React.ReactElement {
  return (
    <ImageBackground
      style={styles.imageBackgroundContainer}
      resizeMode="cover"
      source={require('../../assets/images/react_background.png')}
    >
      <SecureEntry
        style={styles.barcode}
        token={process.env.EXPO_PUBLIC_SECURE_ENTRY_TOKEN || ''}
      />
    </ImageBackground>
  );
}

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
