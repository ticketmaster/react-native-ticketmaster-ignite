import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TicketsSDKOptions from '../../src/components/TicketsSDKOptions';
import { Platform } from 'react-native';

jest.mock('react-native-ticketmaster-ignite', () => {
  const { View, Text } = jest.requireActual('react-native');
  return {
    TicketsSdkModal: jest.fn(() => {
      return (
        <View>
          <Text>Hello Modal</Text>
        </View>
      );
    }),
  };
});

describe('TicketsSDKOptions', () => {
  it('does not show the modal option on android', () => {
    Platform.OS = 'android';

    const { getByText } = render(<TicketsSDKOptions />);

    expect(() => getByText('Tickets SDK (Modal)')).toThrow();
  });

  it('shows the modal option on ios', () => {
    Platform.OS = 'ios';

    const { getByText } = render(<TicketsSDKOptions />);

    expect(() => getByText('Tickets SDK (Modal)')).not.toThrow();
  });

  it('when the modal button is clicked, render the modal from the library', () => {
    Platform.OS = 'ios';

    const { getByText } = render(<TicketsSDKOptions />);

    fireEvent(getByText('Tickets SDK (Modal)'), 'press');

    expect(getByText('Hello Modal')).toBeTruthy();
  });
});
