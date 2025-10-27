import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';

type SectionTextInputProps = {
  title: string;
  value: string;
  placeholder: string;
  defaultValue: string;
  onChangeText: (arg0: string) => void;
  topRounded?: boolean;
  bottomRounded?: boolean;
};

const SectionTextInput = ({
  title,
  placeholder,
  defaultValue,
  value,
  onChangeText,
  topRounded,
  bottomRounded,
}: SectionTextInputProps) => {
  return (
    <View
      style={[
        styles.wrapper,
        topRounded && styles.topItem,
        bottomRounded && styles.bottomItem,
      ]}
    >
      <Text style={styles.textInputTitle}>{title}:</Text>
      <View style={styles.textInputWrapper}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          defaultValue={defaultValue}
          placeholder={placeholder}
          style={styles.textInput}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 70,
    backgroundColor: '#ffffff',
    padding: 10,
  },
  textInputWrapper: { flexDirection: 'row', justifyContent: 'space-between' },
  textInputTitle: { color: '#000000', fontWeight: '600', marginBottom: 5 },
  textInput: {
    color: '#000000',
    width: '100%',
    paddingVertical: 6,
    paddingHorizontal: 5,
    borderColor: 'lightgrey',
    borderWidth: 1,
    borderRadius: 6,
    textAlignVertical: 'center',
  },
  topItem: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  bottomItem: {
    height: 80,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
});

export default SectionTextInput;
