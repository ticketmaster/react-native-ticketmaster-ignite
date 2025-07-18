import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import Configuration from '../screens/Configuration';
import { AppContext } from '../contexts/AppProvider';
import BackButton from '../components/Backbutton';
import Analytics from '../screens/Analytics';
import { RootStackParamList } from '../types/sharedTypes';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Root = () => {
  const { primaryColor } = useContext(AppContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        navigationBarColor: 'transparent',
        statusBarStyle: 'light',
      }}
    >
      <Stack.Screen
        name="Configuration"
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: primaryColor,
          },
          headerTintColor: '#ffffff',
          statusBarColor: primaryColor,
        }}
        component={Configuration}
      />
      <Stack.Screen
        name="BottomTabs"
        options={{
          statusBarColor: primaryColor,
        }}
        component={BottomTabs}
      />
      <Stack.Screen
        name="Analytics"
        options={{
          headerTitleAlign: 'center',
          headerShown: true,
          headerStyle: {
            backgroundColor: primaryColor,
          },
          headerTintColor: '#ffffff',
          statusBarColor: primaryColor,
          headerLeft: () => <BackButton text="Back" />,
        }}
        component={Analytics}
      />
    </Stack.Navigator>
  );
};

export default Root;
