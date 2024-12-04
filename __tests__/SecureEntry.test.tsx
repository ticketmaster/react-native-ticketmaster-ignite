import React from 'react';
import { SecureEntry } from '../src/SecureEntry';
import { render, waitFor } from '@testing-library/react-native';
import { Platform } from 'react-native';

describe('SecureEntryIos', () => {
  beforeAll(() => {
    Platform.OS = 'ios';
  });

  it('renders the SecureEntryIos component after the specified delay', async () => {
    const renderTimeDelay = 500;
    const { queryByTestId, getByTestId } = render(
      <SecureEntry
        token="anyToken"
        style={{ flex: 1 }}
        renderTimeDelay={renderTimeDelay}
      />
    );

    expect(queryByTestId('SecureEntrySdkIos')).toBeNull();

    await waitFor(
      () => {
        expect(getByTestId('SecureEntrySdkIos')).toBeTruthy();
      },
      { timeout: renderTimeDelay + 100 }
    );
  });

  it('renders the SecureEntryIos component immediately if no delay is specified', async () => {
    const { getByTestId } = render(
      <SecureEntry token="anyToken" style={{ flex: 1 }} />
    );

    await waitFor(() => {
      expect(getByTestId('SecureEntrySdkIos')).toBeTruthy();
    });
  });
});

describe('TicketsSdkEmbeddedAndroid', () => {
  beforeAll(() => {
    Platform.OS = 'android';
  });

  it('renders the SecureEntryAndroid component immediately if no delay is specified', async () => {
    const { getByTestId } = render(
      <SecureEntry token="anyToken" style={{ flex: 1 }} />
    );

    await waitFor(() => {
      expect(getByTestId('SecureEntryAndroid')).toBeTruthy();
    });
  });
});
