import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TicketsSdkOptions from '../../src/components/TicketsSdkOptions';
import { TicketsSdkModal } from 'react-native-ticketmaster-ignite';
import { Platform } from 'react-native';

jest.mock('react-native-ticketmaster-ignite', () => ({
  TicketsSdkModal: {
    showTicketsSdkModal: jest.fn(),
  },
}));

describe('TicketsSdkOptions', () => {
  it('does not show the modal option on android', () => {
    Platform.OS = 'android';

    const { getByText } = render(<TicketsSdkOptions />);

    expect(() => getByText('Tickets SDK (Modal)')).toThrow();
  });

  it('shows the modal option on ios', () => {
    Platform.OS = 'ios';

    const { getByText } = render(<TicketsSdkOptions />);

    expect(() => getByText('Tickets SDK (Modal)')).not.toThrow();
  });

  it('when the modal button is clicked, calls showTicketsSdkModal', () => {
    Platform.OS = 'ios';

    const { getByText } = render(<TicketsSdkOptions />);

    fireEvent(getByText('Tickets SDK (Modal)'), 'press');

    expect(TicketsSdkModal!.showTicketsSdkModal).toHaveBeenCalled();
  });
});
