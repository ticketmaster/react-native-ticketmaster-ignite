import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Config from 'react-native-config';
import BottomTabs from './BottomTabs';

const Stack = createNativeStackNavigator();

const Root = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        navigationBarColor: 'transparent',
      }}
    >
      <Stack.Screen
        name="BottomTabs"
        options={{
          animation: 'fade',
          statusBarColor: Config.PRIMARY_COLOR,
          // statusBarStyle: 'light',
        }}
        component={BottomTabs}
      />
    </Stack.Navigator>
  );
};

export default Root;
