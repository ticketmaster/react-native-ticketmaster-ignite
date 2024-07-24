import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import ChevronRight from '../assets/svg/ChevronRight';

export type SDKItemProps = {
  onPress: () => void;
  title: string;
};

const SDKButton = ({ item }: { item: SDKItemProps }) => {
  return (
    <>
      <Pressable
        onPress={() => item.onPress && item.onPress()}
        style={({ pressed }) => [
          styles.item,
          {
            backgroundColor: pressed ? '#00000008' : 'white',
          },
        ]}
      >
        <Text style={styles.title}>{item.title}</Text>
        <View>
          <ChevronRight />
        </View>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    marginHorizontal: 12,
  },
  title: {
    fontSize: 16,
    color: 'black',
  },
});

export default SDKButton;
