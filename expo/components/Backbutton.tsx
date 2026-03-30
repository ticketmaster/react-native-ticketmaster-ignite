import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import ChevronLeft from '@shared/assets/svg/ChevronLeft';

type BackButtonProps = {
  text?: string;
  onPress?: () => void;
};

const BackButton = ({ text = '', onPress }: BackButtonProps) => {
  const goBack = () => {
    router.back();
    // router.replace("/configuration");
  };

  return (
    <Pressable
      onPressOut={() => {
        onPress ? onPress() : goBack();
      }}
    >
      <View style={styles.buttonWrapper}>
        <ChevronLeft color={'#ffffff'} />
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: { flexDirection: 'row', alignItems: 'center' },
  buttonText: { color: '#ffffff', fontSize: 17 },
});

export default BackButton;
