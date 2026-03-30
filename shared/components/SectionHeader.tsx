import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SectionHeader = ({ title }: { title: string }) => {
  return (
    <View style={styles.headerWrapper}>
      <Text style={styles.header}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    color: '#808080',
    fontSize: 20,
  },
  headerWrapper: {
    marginLeft: 20,
    marginTop: 14,
    marginBottom: 8,
  },
});

export default SectionHeader;
