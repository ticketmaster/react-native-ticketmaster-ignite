import { useColorScheme } from '@/components/useColorScheme';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useContext, useEffect, useState } from 'react';
import 'react-native-reanimated';
import { IgniteProvider } from 'react-native-ticketmaster-ignite';
import { AppContext, AppProvider } from '../contexts/AppProvider';
import Logger from '@shared/components/Logger';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useState(true);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { primaryColor } = useContext(AppContext);

  const igniteAnalytics = async (data: any) => {
    console.log('Received Ignite analytics', data);
  };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DarkTheme}>
      <IgniteProvider
        analytics={igniteAnalytics}
        enableLogs={true}
        options={{
          apiKey: process.env.EXPO_PUBLIC_API_KEY || '',
          clientName: process.env.EXPO_PUBLIC_CLIENT_NAME || '',
          primaryColor: `#${process.env.EXPO_PUBLIC_PRIMARY_COLOR}` || '',
          environment: 'Production',
          region: 'UK',
        }}
      >
        <AppProvider>
          <Logger />
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                headerTitle: 'Configuration',
                headerShown: true,
                headerBackVisible: false,
                headerStyle: {
                  backgroundColor: primaryColor,
                },
                headerTintColor: '#ffffff',
              }}
            />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="analytics"
              options={{
                headerTitle: 'Analytics',
                headerShown: true,
                headerStyle: {
                  backgroundColor: primaryColor,
                },
                headerTintColor: '#ffffff',
              }}
            />
          </Stack>
        </AppProvider>
      </IgniteProvider>
    </ThemeProvider>
  );
}
