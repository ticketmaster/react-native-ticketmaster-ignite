import React from 'react';
import { TicketsSdkEmbeddedIos } from '../src/TicketsSdkEmbeddedIos';
import { render, waitFor } from '@testing-library/react-native';
import { Platform } from 'react-native';

describe('TicketsSdkEmbeddedIos', () => {
  beforeAll(() => {
    Platform.OS = 'ios';
  });

  it('renders the TicketsSdk component after the specified delay', async () => {
    const renderTimeDelay = 500;
    const { queryByTestId, getByTestId } = render(
      <TicketsSdkEmbeddedIos
        style={{ flex: 1 }}
        renderTimeDelay={renderTimeDelay}
      />
    );

    expect(queryByTestId('TicketsSdk')).toBeNull();

    await waitFor(
      () => {
        expect(getByTestId('TicketsSdk')).toBeTruthy();
      },
      { timeout: renderTimeDelay + 100 }
    );
  });

  it('renders the TicketsSdk component immediately if no delay is specified', async () => {
    const { getByTestId } = render(
      <TicketsSdkEmbeddedIos style={{ flex: 1 }} />
    );

    await waitFor(() => {
      expect(getByTestId('TicketsSdk')).toBeTruthy();
    });
  });
});
