import React from 'react';
import { render } from '@testing-library/react-native';
import { TicketsSdkModal } from '../src/TicketsSdkModal';

const mockSetShowTicketsModal = jest.fn();

describe('<TicketsSdkModal />', () => {
  it('renders TicketsSdkModal when showTicketsModal is true', async () => {
    const { getByTestId } = render(
      <TicketsSdkModal
        showTicketsModal={true}
        setShowTicketsModal={mockSetShowTicketsModal}
      />
    );

    expect(() => getByTestId('ticketsSDKWrapper')).not.toThrow();
  });

  it('does not render TicketsSdkModal when showTicketsModal is false', async () => {
    const { getByTestId } = render(
      <TicketsSdkModal
        showTicketsModal={false}
        setShowTicketsModal={mockSetShowTicketsModal}
      />
    );

    expect(() => getByTestId('ticketsSDKWrapper')).toThrow();
  });
});
