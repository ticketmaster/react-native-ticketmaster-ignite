import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import ChevronRight from '../assets/svg/ChevronRight';

export type SdkItemProps = {
  onPress: () => void;
  title: string;
  first?: boolean;
  last?: boolean;
};

const SDKButton = ({ item }: { item: SdkItemProps }) => {
  return (
    <>
      <Pressable
        onPress={() => item.onPress && item.onPress()}
        style={({ pressed }) => [
          styles.item,
          item.first && styles.topItem,
          item.last && styles.bottomItem,
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
  topItem: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  bottomItem: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
});

export default SDKButton;
