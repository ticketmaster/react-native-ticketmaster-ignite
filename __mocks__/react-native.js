import React from 'react';
const ReactNative = jest.requireActual('react-native');

const RNTTicketsSdkView = props => (
  <View {...props} testID="RNTTicketsSdkViewMock"><Text>Hello</Text></View>
);

ReactNative.requireNativeComponent = jest.fn(name => {
  if (name === 'RNTTicketsSdkView') {
    return RNTTicketsSdkView;
  }
  return name;
});

module.exports = ReactNative;
