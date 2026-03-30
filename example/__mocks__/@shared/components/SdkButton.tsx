import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface SdkButtonProps {
  title: string;
  onPress?: () => void;
}

const SdkButton = ({ title, onPress }: SdkButtonProps) => (
  <Pressable onPress={onPress}>
    <View>
      <Text>{title}</Text>
    </View>
  </Pressable>
);

export default SdkButton;
