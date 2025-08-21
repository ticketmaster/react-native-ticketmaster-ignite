import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { IgniteProvider } from 'react-native-ticketmaster-ignite';
import Config from 'react-native-config';
import Root from './navigators/Root';
import { AppProvider } from './contexts/AppProvider';
import Logger from './components/Logger';

const App = () => {
  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#F5F5F5',
    },
  };

  const igniteAnalytics = async (data: any) => {
    console.log(`Analytics: ${JSON.stringify(data)}`);
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme}>
        <IgniteProvider
          analytics={igniteAnalytics}
          enableLogs={true}
          options={{
            apiKey: Config.API_KEY || '',
            clientName: Config.CLIENT_NAME || '',
            primaryColor: Config.PRIMARY_COLOR || '',
            eventHeaderType: 'EVENT_INFO_SHARE',
            marketDomain: 'US',
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
              image: require('../assets/seatUpgradesOverride.png'),
              topLabelText: 'Custom Top Level Text',
              bottomLabelText: 'Custom Bottom Level Text',
            },
            venueConcessionsModule: {
              image: require('../assets/venueConcessionsOverride.png'),
              topLabelText: 'Custom Top Level Text',
              bottomLabelText: 'Custom Bottom Level Text',
              enabled: true,
              orderButtonCallback: () => {},
              walletButtonCallback: () => {},
            },
            invoiceModule: {
              enabled: true,
            },
          }}
        >
          <AppProvider>
            <Logger />
            <Root />
          </AppProvider>
        </IgniteProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
export default App;
