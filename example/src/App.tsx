import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { IgniteProvider } from 'react-native-ticketmaster-ignite';
import Config from 'react-native-config';
import Root from './navigators/Root';

const App = () => {
  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#F5F5F5',
    },
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme}>
        <IgniteProvider
          options={{
            apiKey: Config.API_KEY || '',
            clientName: Config.CLIENT_NAME || '',
          }}
        >
          <Root />
        </IgniteProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
export default App;
