import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TicketsSdkOptions from '../../src/components/TicketsSdkOptions';
import { Platform } from 'react-native';

describe('TicketsSDKOptions', () => {
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

  it('when the modal button is clicked, render the modal from the library', () => {
    Platform.OS = 'ios';

    const { getByText } = render(<TicketsSdkOptions />);

    fireEvent(getByText('Tickets SDK (Modal)'), 'press');

    expect(getByText('Hello Modal')).toBeTruthy();
  });
});
