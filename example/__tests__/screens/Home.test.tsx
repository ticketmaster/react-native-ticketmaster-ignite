import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Home from '../../src/screens/Home';
import { useIgnite } from 'react-native-ticketmaster-ignite';
import { ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('react-native-ticketmaster-ignite');

const mockedUseIgnite = useIgnite as jest.MockedFunction<typeof useIgnite>;

describe('Home', () => {
  const loginMock = jest.fn();
  const logoutMock = jest.fn();
  const getTokenMock = jest.fn();
  const refreshTokenMock = jest.fn();
  const getMemberInfoMock = jest.fn();
  const getIsLoggedInMock = jest.fn();

  beforeAll(() => {
    jest.clearAllMocks();

    // @ts-ignore
    mockedUseIgnite.mockReturnValue({
      login: loginMock,
      logout: logoutMock,
      getToken: getTokenMock,
      refreshToken: refreshTokenMock,
      getMemberInfo: getMemberInfoMock,
      getIsLoggedIn: getIsLoggedInMock,
    });
  });

  describe('Accounts SDK', () => {
    describe('uses isLogging status to show spinner', () => {
      it('shows the ActivityIndicator when isLogging in is true', async () => {
        // @ts-ignore
        mockedUseIgnite.mockReturnValue({
          isLoggingIn: true,
          authState: {
            isLoggedIn: false,
            isConfigured: false,
            memberInfo: null,
          },
        });

        const component = render(
          <NavigationContainer>
            <Home
              // @ts-ignore
              route={{
                params: {
                  attractionId: 'testAttractionID',
                  eventId: 'testEventID',
                  venueId: 'testVenueID',
                },
              }}
            />
          </NavigationContainer>
        );

        await waitFor(() => {
          const spinner = component.root.findByType(ActivityIndicator);

          expect(spinner).toBeTruthy();
        });
      });

      it('does not show the ActivityIndicator when isLogging in is false', async () => {
        // @ts-ignore
        mockedUseIgnite.mockReturnValue({
          isLoggingIn: false,
          authState: {
            isLoggedIn: false,
            isConfigured: false,
            memberInfo: null,
          },
        });

        const component = render(
          <NavigationContainer>
            <Home
              // @ts-ignore
              route={{
                params: {
                  attractionId: 'testAttractionID',
                  eventId: 'testEventID',
                  venueId: 'testVenueID',
                },
              }}
            />
          </NavigationContainer>
        );

        await waitFor(() => {
          expect(() => component.root.findByType(ActivityIndicator)).toThrow();
        });
      });
    });
  });
});
