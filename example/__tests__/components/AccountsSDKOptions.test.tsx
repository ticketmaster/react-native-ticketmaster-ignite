import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AccountsSDKOptions from '../../src/components/AccountsSDKOptions';
import { useIgnite } from 'react-native-ticketmaster-ignite';

describe('AccountsSDKOptions', () => {
  const loginMock = jest.fn();
  const logoutMock = jest.fn();
  const getTokenMock = jest.fn();
  const refreshTokenMock = jest.fn();
  const getMemberInfoMock = jest.fn();
  const getIsLoggedInMock = jest.fn();

  beforeAll(() => {
    jest.clearAllMocks();

    // @ts-ignore
    useIgnite.mockReturnValue({
      login: loginMock,
      logout: logoutMock,
      getToken: getTokenMock,
      refreshToken: refreshTokenMock,
      getMemberInfo: getMemberInfoMock,
      getIsLoggedIn: getIsLoggedInMock,
      authState: { isLoggedIn: false },
    });
  });

  describe('AccountsSDKOptions', () => {
    describe('when button is clicked, calls the library function', () => {
      it('calls login func for Login button', () => {
        const { getByText } = render(<AccountsSDKOptions />);

        fireEvent(getByText('Login'), 'press');

        expect(loginMock).toHaveBeenCalled();
      });

      it('calls logout func for Logout button', () => {
        const { getByText } = render(<AccountsSDKOptions />);

        fireEvent(getByText('Logout'), 'press');

        expect(logoutMock).toHaveBeenCalled();
      });

      it('calls getToken func for Get Token button', () => {
        const { getByText } = render(<AccountsSDKOptions />);

        fireEvent(getByText('Get Token'), 'press');

        expect(getTokenMock).toHaveBeenCalled();
      });

      it('calls refreshToken func for Refresh Token button', () => {
        const { getByText } = render(<AccountsSDKOptions />);

        fireEvent(getByText('Refresh Token'), 'press');

        expect(refreshTokenMock).toHaveBeenCalled();
      });

      it('calls getMemberInfo func for Get Member button', () => {
        const { getByText } = render(<AccountsSDKOptions />);

        fireEvent(getByText('Get Member'), 'press');

        expect(getMemberInfoMock).toHaveBeenCalled();
      });

      it('calls getIsLoggedIn for isLoggedIn button', () => {
        const { getByText } = render(<AccountsSDKOptions />);

        fireEvent(getByText(`IsLoggedIn - ${false}`), 'press');
        expect(getIsLoggedInMock).toHaveBeenCalled();
      });
    });
  });
});
