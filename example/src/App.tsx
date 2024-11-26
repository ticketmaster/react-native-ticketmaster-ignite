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

  // const igniteAnalytics = async (data: any) => {
  //   console.log('Received Ignite analytics', data);
  // };

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme}>
        <IgniteProvider
          // analytics={igniteAnalytics}
          options={{
            apiKey: Config.API_KEY || '',
            clientName: Config.CLIENT_NAME || '',
            primaryColor: Config.PRIMARY_COLOR || '',
            eventHeaderType: 'EVENT_INFO',
          }}
          prebuiltModules={{
            moreTicketActionsModule: {
              enabled: true,
            },
            venueDirectionsModule: {
              enabled: true,
            },
            seatUpgradesModule: {
              enabled: true,
            },
            venueConcessionsModule: {
              enabled: true,
              orderButtonCallback: () => {},
              walletButtonCallback: () => {},
            },
            invoiceModule: {
              enabled: true,
            },
          }}
        >
          <Root />
        </IgniteProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
export default App;
