import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
          statusBarColor: 'transparent',
          statusBarStyle: 'light',
        }}
        component={BottomTabs}
      />
    </Stack.Navigator>
  );
};

export default Root;
