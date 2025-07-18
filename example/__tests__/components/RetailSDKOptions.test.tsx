import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RetailSDKOptions from '../../src/components/RetailSDKOptions';
import { RetailSDK } from 'react-native-ticketmaster-ignite';

jest.mock('react-native-ticketmaster-ignite', () => ({
  RetailSDK: {
    presentPrePurchaseVenue: jest.fn(),
    presentPrePurchaseAttraction: jest.fn(),
    presentPurchase: jest.fn(),
  },
}));

describe('RetailSDKOptions', () => {
  it('calls presentPrePurchaseVenue with venue ID when Show Retail PrePurchase Venue is clicked', () => {
    const fakePresentPrePurchaseVenue = RetailSDK.presentPrePurchaseVenue;
    const { getByText } = render(
      <RetailSDKOptions
        attractionId={''}
        eventId={''}
        venueId={'testVenueID'}
      />
    );

    fireEvent(getByText('PrePurchase Venue'), 'press');

    expect(fakePresentPrePurchaseVenue).toHaveBeenCalledWith('testVenueID');
  });

  it('calls presentPrePurchaseAttraction with attraction ID when Show Retail PrePurchase Attraction is clicked', () => {
    const fakePresentPrePurchaseAttraction =
      RetailSDK.presentPrePurchaseAttraction;
    const { getByText } = render(
      <RetailSDKOptions
        attractionId={'testAttractionID'}
        eventId={''}
        venueId={''}
      />
    );

    fireEvent(getByText('PrePurchase Attraction'), 'press');

    expect(fakePresentPrePurchaseAttraction).toHaveBeenCalledWith(
      'testAttractionID'
    );
  });

  it('calls presentPurchase with event ID when Show Retail Purchase is clicked', () => {
    const fakePresentPurchase = RetailSDK.presentPurchase;
    const { getByText } = render(
      <RetailSDKOptions
        attractionId={''}
        eventId={'testEventID'}
        venueId={''}
      />
    );

    fireEvent(getByText('Purchase'), 'press');

    expect(fakePresentPurchase).toHaveBeenCalledWith('testEventID');
  });
});
