import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
// @ts-ignore
import MyEvents from '../screens/MyEvents';
import HomeIcon from '../assets/svg/HomeIcon';
import MyEventsIcon from '../assets/svg/MyEventsIcon';
import SecureEntryView from '../screens/SecureEntryView';
import { AppContext } from '../contexts/AppProvider';
import BackButton from '../components/Backbutton';
import { BottomTabsParamList } from '../types/sharedTypes';

const Tab = createBottomTabNavigator<BottomTabsParamList>();

const BottomTabs = () => {
  const { primaryColor } = useContext(AppContext);
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerShown: true,
        headerStyle: {
          backgroundColor: primaryColor,
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
        tabBarActiveTintColor: primaryColor,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <HomeIcon fill={focused ? primaryColor : 'grey'} />
          ),
          headerLeft: () => <BackButton text="Back" />,
        }}
      />
      <Tab.Screen
        name="TicketsSdkEmbedded"
        component={MyEvents}
        options={{
          headerTitle: 'Tickets SDK',
          headerShadowVisible: false,
          tabBarLabel: 'Tickets SDK',
          tabBarIcon: ({ focused }) => (
            <MyEventsIcon fill={focused ? primaryColor : 'grey'} />
          ),
        }}
      />
      <Tab.Screen
        name="SecureEntry"
        component={SecureEntryView}
        options={{
          headerTitle: 'Secure Entry SDK',
          headerShadowVisible: false,
          tabBarLabel: 'Secure Entry',
          tabBarIcon: ({ focused }) => (
            <MyEventsIcon fill={focused ? primaryColor : 'grey'} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
