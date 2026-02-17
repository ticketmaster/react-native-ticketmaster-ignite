import React from 'react';
import { SecureEntry } from '../src/SecureEntry';
import { render } from '@testing-library/react-native';

describe('SecureEntry', () => {
  it('renders the SecureEntry component with a token', () => {
    const { toJSON } = render(
      <SecureEntry token="anyToken" style={{ flex: 1 }} />
    );

    expect(toJSON()).toBeTruthy();
  });
});
