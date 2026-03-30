import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Home from '../../app/(tabs)/index';
import { useIgnite } from 'react-native-ticketmaster-ignite';
import { ActivityIndicator } from 'react-native';

jest.mock('react-native-ticketmaster-ignite', () => ({
  useIgnite: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({
    attractionId: 'testAttractionID',
    eventId: 'testEventID',
    venueId: 'testVenueID',
  }),
  router: {
    push: jest.fn(),
  },
}));

/**
 * Mock shared components for screen testing.
 *
 * IMPORTANT: Jest's react-native preset only initializes RN mocks for files within
 * the test runner's rootDir. Files in shared/ are outside both expo/ and example/
 * rootDirs, causing native module bridging errors (e.g., "__fbBatchedBridgeConfig
 * is not set" when StyleSheet.create() runs).
 *
 * Both expo and example tests must mock shared components. If direct testing of
 * shared component internals is needed, set up a test runner at the monorepo root
 * or create a shared/ workspace with its own jest config.
 */
jest.mock('../../../shared/components/AccountsSdkOptions', () => {
  const { View } = require('react-native');
  return () => <View testID="AccountsSdkOptions" />;
});

jest.mock('../../../shared/components/RetailSdkOptions', () => {
  const { View } = require('react-native');
  return () => <View testID="RetailSdkOptions" />;
});

jest.mock('../../../shared/components/TicketsSdkOptions', () => {
  const { View } = require('react-native');
  return () => <View testID="TicketsSdkOptions" />;
});

jest.mock('../../components/AnalyticsOptions', () => {
  const { View } = require('react-native');
  return () => <View testID="AnalyticsOptions" />;
});

const mockedUseIgnite = useIgnite as jest.MockedFunction<typeof useIgnite>;

describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Accounts SDK', () => {
    describe('uses isLogging status to show spinner', () => {
      it('shows the ActivityIndicator when isLoggingIn is true', async () => {
        // @ts-ignore
        mockedUseIgnite.mockReturnValue({
          isLoggingIn: true,
          authState: {
            isLoggedIn: false,
            isConfigured: false,
            memberInfo: null,
          },
        });

        const component = render(<Home />);

        await waitFor(() => {
          const spinner = component.root.findByType(ActivityIndicator);
          expect(spinner).toBeTruthy();
        });
      });

      it('does not show the ActivityIndicator when isLoggingIn is false', async () => {
        // @ts-ignore
        mockedUseIgnite.mockReturnValue({
          isLoggingIn: false,
          authState: {
            isLoggedIn: false,
            isConfigured: false,
            memberInfo: null,
          },
        });

        const component = render(<Home />);

        await waitFor(() => {
          expect(() => component.root.findByType(ActivityIndicator)).toThrow();
        });
      });
    });

    describe('displays configuration status', () => {
      it('shows isConfigured status', async () => {
        // @ts-ignore
        mockedUseIgnite.mockReturnValue({
          isLoggingIn: false,
          authState: {
            isLoggedIn: false,
            isConfigured: true,
            memberInfo: null,
          },
        });

        const { getByText } = render(<Home />);

        await waitFor(() => {
          expect(
            getByText(/Accounts SDK successfully configured/)
          ).toBeTruthy();
        });
      });

      it('shows logged in user email when isLoggedIn is true', async () => {
        // @ts-ignore
        mockedUseIgnite.mockReturnValue({
          isLoggingIn: false,
          authState: {
            isLoggedIn: true,
            isConfigured: true,
            memberInfo: { email: 'test@example.com' },
          },
        });

        const { getByText } = render(<Home />);

        await waitFor(() => {
          expect(getByText(/Logged in as/)).toBeTruthy();
        });
      });
    });
  });
});
