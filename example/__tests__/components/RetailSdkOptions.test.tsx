import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RetailSdkOptions from '@shared/components/RetailSdkOptions';
import { RetailSdk } from 'react-native-ticketmaster-ignite';

jest.mock('react-native-ticketmaster-ignite', () => ({
  RetailSdk: {
    presentPrePurchaseVenue: jest.fn(),
    presentPrePurchaseAttraction: jest.fn(),
    presentPurchase: jest.fn(),
  },
}));

describe('RetailSdkOptions', () => {
  it('calls presentPrePurchaseVenue with venue ID when Show Retail PrePurchase Venue is clicked', () => {
    const fakePresentPrePurchaseVenue = RetailSdk.presentPrePurchaseVenue;
    const { getByText } = render(
      <RetailSdkOptions
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
      RetailSdk.presentPrePurchaseAttraction;
    const { getByText } = render(
      <RetailSdkOptions
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
    const fakePresentPurchase = RetailSdk.presentPurchase;
    const { getByText } = render(
      <RetailSdkOptions
        attractionId={''}
        eventId={'testEventID'}
        venueId={''}
      />
    );

    fireEvent(getByText('Purchase'), 'press');

    expect(fakePresentPurchase).toHaveBeenCalledWith('testEventID');
  });
});
