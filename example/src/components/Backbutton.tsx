import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ChevronLeft from '../assets/svg/ChevronLeft';

type BackButtonProps = {
  text?: string;
  onPress?: () => void;
};

const BackButton = ({ text = '', onPress }: BackButtonProps) => {
  const navigation = useNavigation();

  const goBack = () => {
    navigation.goBack();
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
