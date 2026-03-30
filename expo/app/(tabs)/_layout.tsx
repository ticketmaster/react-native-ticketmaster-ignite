import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import React, { useContext } from 'react';
import BackButton from '../../components/Backbutton';
import { AppContext } from '../../contexts/AppProvider';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { primaryColor } = useContext(AppContext);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        headerStyle: {
          backgroundColor: primaryColor,
        },
        sceneStyle: {
          backgroundColor: '#F5F5F5',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ignite',
          tabBarIcon: ({ color }) => <TabBarIcon name="fire" color={color} />,
          headerLeft: () => <BackButton text="Back" />,
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'Tickets',
          tabBarIcon: ({ color }) => <TabBarIcon name="ticket" color={color} />,
        }}
      />
      <Tabs.Screen
        name="secure-entry"
        options={{
          title: 'Secure Entry',
          headerShown: true,
          tabBarIcon: ({ color }) => <TabBarIcon name="ticket" color={color} />,
        }}
      />
    </Tabs>
  );
}
