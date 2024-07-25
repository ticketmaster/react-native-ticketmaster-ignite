import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Home from '../../src/screens/Home';
import { useIgnite } from 'react-native-ticketmaster-ignite';
import { ActivityIndicator } from 'react-native';

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
    useIgnite.mockReturnValue({
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
        useIgnite.mockReturnValue({
          isLoggingIn: true,
        });

        const component = render(<Home />);

        await waitFor(() => {
          const spinner = component.root.findByType(ActivityIndicator);

          expect(spinner).toBeTruthy();
        });
      });

      it('does not show the ActivityIndicator when isLogging in is false', async () => {
        // @ts-ignore
        useIgnite.mockReturnValue({
          isLoggingIn: false,
        });

        const component = render(<Home />);

        await waitFor(() => {
          expect(() => component.root.findByType(ActivityIndicator)).toThrow();
        });
      });
    });
  });
});
