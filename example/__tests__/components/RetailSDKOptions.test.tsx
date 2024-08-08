import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RetailSdkOptions from '../../src/components/RetailSdkOptions';
import { RetailSDK } from 'react-native-ticketmaster-ignite';

describe('RetailSDKOptions', () => {
  it('calls presentPrePurchaseVenue with venue ID when Show Retail PrePurchase Venue is clicked', () => {
    const fakePresentPrePurchaseVenue = RetailSDK.presentPrePurchaseVenue;
    const { getByText } = render(<RetailSdkOptions />);

    fireEvent(getByText('Show Retail PrePurchase Venue'), 'press');

    expect(fakePresentPrePurchaseVenue).toHaveBeenCalledWith('testVenueID');
  });

  it('calls presentPrePurchaseAttraction with attraction ID when Show Retail PrePurchase Attraction is clicked', () => {
    const fakePresentPrePurchaseAttraction =
      RetailSDK.presentPrePurchaseAttraction;
    const { getByText } = render(<RetailSdkOptions />);

    fireEvent(getByText('Show Retail PrePurchase Attraction'), 'press');

    expect(fakePresentPrePurchaseAttraction).toHaveBeenCalledWith(
      'testAttractionID'
    );
  });

  it('calls presentPurchase with event ID when Show Retail Purchase is clicked', () => {
    const fakePresentPurchase = RetailSDK.presentPurchase;
    const { getByText } = render(<RetailSdkOptions />);

    fireEvent(getByText('Show Retail Purchase'), 'press');

    expect(fakePresentPurchase).toHaveBeenCalledWith('testEventID');
  });
});
