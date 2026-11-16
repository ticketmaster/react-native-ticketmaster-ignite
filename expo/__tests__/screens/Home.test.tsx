import React from 'react';
import {
  render,
  waitFor,
  type RenderResult,
} from '@testing-library/react-native';
import Home from '../../app/(tabs)/index';
import { useIgnite } from 'react-native-ticketmaster-ignite';

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

// React Native's jest preset mocks `ActivityIndicator` as a host component of the
// same name. Testing Library 14 (test-renderer) only exposes host instances, so
// look the spinner up by its host type instead of the composite component.
const queryActivityIndicators = (root: RenderResult['root']) =>
  root?.queryAll((node) => node.type === 'ActivityIndicator') ?? [];

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

        const component = await render(<Home />);

        await waitFor(() => {
          expect(queryActivityIndicators(component.root)).toHaveLength(1);
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

        const component = await render(<Home />);

        await waitFor(() => {
          expect(queryActivityIndicators(component.root)).toHaveLength(0);
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

        const { getByText } = await render(<Home />);

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

        const { getByText } = await render(<Home />);

        await waitFor(() => {
          expect(getByText(/Logged in as/)).toBeTruthy();
        });
      });
    });
  });
});
