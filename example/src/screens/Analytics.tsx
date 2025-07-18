import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppContext } from '../contexts/AppProvider';

const Analytics = () => {
  const { logs } = useContext(AppContext);
  return (
    <ScrollView style={styles.scrollViewContainer}>
      {logs.map((log, index) => (
        <View key={index.toString()} style={styles.logWrapper}>
          <View style={styles.labelWrapper}>
            <Text style={styles.logType}>{log.type}</Text>
          </View>
          <View style={styles.logMessageWrapper}>
            <Text style={styles.timeStamp}>{log.timestamp}</Text>
            <Text style={styles.messageText}>
              {JSON.stringify(log.message)
                .replace(/\\/g, '')
                .replace(/""/g, '')}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: { backgroundColor: '#ffffff', marginBottom: 20 },
  logWrapper: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  labelWrapper: {
    margin: 10,
    width: 60,
    height: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#5cb85c',
  },
  logMessageWrapper: {
    backgroundColor: '#ffffff',
    width: '100%',
    alignSelf: 'center',
    borderRadius: 4,
    paddingTop: 5,
  },
  timeStamp: { marginLeft: 10, fontWeight: '700', color: '#000000' },
  messageText: { marginLeft: 10, width: '75%', color: '#000000' },
  logType: {
    textTransform: 'capitalize',
    color: '#000000',
  },
});

export default Analytics;
