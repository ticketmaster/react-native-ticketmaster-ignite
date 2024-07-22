import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
// @ts-ignore
import MyEvents from '../screens/MyEvents';
import HomeIcon from '../assets/svg/HomeIcon';
import MyEventsIcon from '../assets/svg/MyEventsIcon';
import Config from 'react-native-config';
import SecureEntryView from '../screens/SecureEntryView.android';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerShown: true,
        headerStyle: {
          backgroundColor: Config.PRIMARY_COLOR,
        },
        headerTintColor: 'white',
        tabBarStyle: {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.39,
          shadowRadius: 8.3,
          elevation: 24,
          backgroundColor: 'white',
          position: 'absolute',
          bottom: 0,
        },
        tabBarActiveTintColor: Config.PRIMARY_COLOR,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <HomeIcon fill={focused ? Config.PRIMARY_COLOR : 'grey'} />
          ),
        }}
      />
      <Tab.Screen
        name="Tickets SDK (Embedded)"
        component={MyEvents}
        options={{
          tabBarLabel: 'Tickets SDK (Embedded)',
          unmountOnBlur: true,
          tabBarIcon: ({ focused }) => (
            <MyEventsIcon fill={focused ? Config.PRIMARY_COLOR : 'grey'} />
          ),
        }}
      />
      <Tab.Screen
        name="Secure Entry"
        component={SecureEntryView}
        options={{
          tabBarLabel: 'Secure Entry',
          unmountOnBlur: true,
          tabBarIcon: ({ focused }) => (
            <MyEventsIcon fill={focused ? Config.PRIMARY_COLOR : 'grey'} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
