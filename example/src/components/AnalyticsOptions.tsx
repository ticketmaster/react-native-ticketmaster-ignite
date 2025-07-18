import React from 'react';
import { StyleSheet, View } from 'react-native';
import SectionHeader from './SectionHeader';
import SDKButton from './SDKButton';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/sharedTypes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type AnalyticsProps = {};

const AnalyticsOptions = ({}: AnalyticsProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.wrapper}>
      <SectionHeader title="Analytics" />
      <SDKButton
        item={{
          title: `Analytic logs`,
          onPress: () => navigation.navigate('Analytics'),
          first: true,
          last: true,
        }}
        key={`Analytics`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 100 },
});

export default AnalyticsOptions;
