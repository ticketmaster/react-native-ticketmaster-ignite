import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SecureEntry } from 'react-native-ticketmaster-ignite';

// `ImageBackground` is deprecated in React Native 0.88 — the recommended
// replacement is a View with an absolutely positioned Image behind the content.
export default function SecureEntryView(): React.ReactElement {
  return (
    <View style={styles.imageBackgroundContainer}>
      <Image
        style={styles.backgroundImage}
        resizeMode="cover"
        source={require('../../assets/images/react_background.png')}
      />
      <SecureEntry
        style={styles.barcode}
        token={process.env.EXPO_PUBLIC_SECURE_ENTRY_TOKEN || ''}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imageBackgroundContainer: {
    flex: 1,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  // Literal types are kept on purpose: the library's `style` prop is typed against the
  // monorepo root's react-native 0.81 types, whose DimensionValue has no plain `string`.
  barcode: {
    top: '30%' as const,
    height: 300,
    width: '70%' as const,
    alignSelf: 'center',
  },
});
