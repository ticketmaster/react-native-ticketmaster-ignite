import React from 'react';
import { View, Text } from 'react-native';

interface SectionHeaderProps {
  title: string;
}

const SectionHeader = ({ title }: SectionHeaderProps) => (
  <View>
    <Text>{title}</Text>
  </View>
);

export default SectionHeader;
