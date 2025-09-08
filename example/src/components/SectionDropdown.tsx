import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

type SectionDropdownProps = {
  title: string;
  data: string[];
  defaultValue: string;
  onSelect: (arg0: string) => void;
  topRounded?: boolean;
  bottomRounded?: boolean;
};

const SectionDropdown = ({
  title,
  data,
  defaultValue,
  onSelect,
  topRounded,
  bottomRounded,
}: SectionDropdownProps) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const toggleDropdown = () => setDropdownVisible(!isDropdownVisible);
  const handleSelect = (item: string) => {
    setSelectedValue(item);
    onSelect(item);
    setDropdownVisible(false);
  };
  return (
    <View
      style={[
        styles.container,
        topRounded && styles.topItem,
        bottomRounded && styles.bottomItem,
      ]}
    >
      <Text style={styles.dropdownTitle}>{title}:</Text>
      <TouchableOpacity style={styles.button} onPress={toggleDropdown}>
        <Text style={styles.buttonText}>
          {selectedValue || defaultValue || 'Select an option'}
        </Text>
      </TouchableOpacity>
      {isDropdownVisible && (
        <View style={styles.dropdown}>
          <FlatList
            data={data}
            // @ts-ignore
            keyExtractor={(item, index) => index.toString()}
            horizontal={false}
            nestedScrollEnabled={true}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxHeight: 200,
    backgroundColor: '#ffffff',
    padding: 10,
  },
  button: {
    width: '100%',
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  dropdownTitle: {
    color: '#000000',
    fontWeight: '600',
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  dropdown: {
    marginTop: 5,
    marginBottom: 50,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    color: '#000000',
    fontSize: 16,
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

export default SectionDropdown;
