import React from 'react';
import { TicketsSdkEmbedded } from '../src/TicketsSdkEmbedded';
import { render } from '@testing-library/react-native';

describe('TicketsSdkEmbedded', () => {
  it('renders the TicketsSdkEmbedded component', () => {
    const { toJSON } = render(<TicketsSdkEmbedded style={{ flex: 1 }} />);

    expect(toJSON()).toBeTruthy();
  });
});
