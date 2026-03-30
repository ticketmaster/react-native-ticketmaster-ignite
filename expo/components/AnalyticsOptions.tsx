import React from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import SectionHeader from '@shared/components/SectionHeader';
import SdkButton from '@shared/components/SdkButton';

const AnalyticsOptions = (): React.ReactElement => {
  return (
    <View style={styles.wrapper}>
      <SectionHeader title="Analytics" />
      <SdkButton
        item={{
          title: 'Analytic logs',
          onPress: () => router.push('/analytics'),
          first: true,
          last: true,
        }}
        key="Analytics"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 100 },
});

export default AnalyticsOptions;
