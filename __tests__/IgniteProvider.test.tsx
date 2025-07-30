import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { NativeModules, View, Platform } from 'react-native';
import { IgniteProvider } from '../src';
import { IgniteContext } from '../src/IgniteProvider';

describe('IgniteProvider', () => {
  const fakeApiKey = 'AAA';
  const fakeClientName = 'SomeName';
  const fakePrimaryColor = '#FF0000';
  const options = {
    apiKey: fakeApiKey,
    clientName: fakeClientName,
    primaryColor: fakePrimaryColor,
  };

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
  });

  const component = (
    <IgniteProvider options={options}>
      <View />
    </IgniteProvider>
  );

  describe('Calling setConfig on the Config NativeModule on render', () => {
    const fakeSetConfig = jest.fn();
    const fakeSetImage = jest.fn();
    const fakeConfigureAccountsSDK = jest.fn(() =>
      Promise.resolve('configured')
    );
    const fakeIsLoggedIn = jest.fn(() => Promise.resolve());

    beforeAll(() => {
      jest.clearAllMocks();
    });

    beforeEach(() => {
      NativeModules.Config = {
        setConfig: fakeSetConfig,
        setImage: fakeSetImage,
      };
      NativeModules.AccountsSDK = {
        configureAccountsSDK: fakeConfigureAccountsSDK,
        isLoggedIn: fakeIsLoggedIn,
      };
    });

    it('with api key', () => {
      render(component);

      expect(fakeSetConfig).toHaveBeenCalledWith('apiKey', fakeApiKey);
    });

    it('with client name', () => {
      render(component);

      expect(fakeSetConfig).toHaveBeenCalledWith('clientName', fakeClientName);
    });

    it('with primary color', () => {
      render(component);

      expect(fakeSetConfig).toHaveBeenCalledWith(
        'primaryColor',
        fakePrimaryColor
      );
    });

    describe('with region', () => {
      it('calls with the custom region when passed', () => {
        render(
          <IgniteProvider options={{ ...options, region: 'UK' }}>
            <View />
          </IgniteProvider>
        );

        expect(fakeSetConfig).toHaveBeenCalledWith('region', 'UK');
      });

      it('calls with the US region when no region passed', () => {
        render(component);

        expect(fakeSetConfig).toHaveBeenCalledWith('region', 'US');
      });
    });

    describe('with marketDomain', () => {
      it('calls with the custom marketDomain when passed', () => {
        render(
          <IgniteProvider options={{ ...options, marketDomain: 'UK' }}>
            <View />
          </IgniteProvider>
        );

        expect(fakeSetConfig).toHaveBeenCalledWith('marketDomain', 'UK');
      });

      it('calls with the US marketDomain when no marketDomain passed', () => {
        render(component);

        expect(fakeSetConfig).toHaveBeenCalledWith('marketDomain', 'US');
      });
    });

    describe('with eventHeaderType', () => {
      it('calls with the custom eventHeaderType when passed', () => {
        render(
          <IgniteProvider
            options={{ ...options, eventHeaderType: 'EVENT_INFO' }}
          >
            <View />
          </IgniteProvider>
        );

        expect(fakeSetConfig).toHaveBeenCalledWith(
          'eventHeaderType',
          'EVENT_INFO'
        );
      });

      it('calls with the EVENT_INFO_SHARE eventHeaderType when no eventHeaderType passed', () => {
        render(component);

        expect(fakeSetConfig).toHaveBeenCalledWith(
          'eventHeaderType',
          'EVENT_INFO_SHARE'
        );
      });
    });

    describe('with prebuiltModules', () => {
      describe('moreTicketActionsModule', () => {
        it('calls with true when moreTicketActionsModule passed as true', () => {
          render(
            <IgniteProvider
              options={options}
              prebuiltModules={{ moreTicketActionsModule: { enabled: true } }}
            >
              <View />
            </IgniteProvider>
          );

          expect(fakeSetConfig).toHaveBeenCalledWith(
            'moreTicketActionsModule',
            'true'
          );
        });

        it('calls with false when moreTicketActionsModule passed as false', () => {
          render(
            <IgniteProvider
              options={options}
              prebuiltModules={{ moreTicketActionsModule: { enabled: false } }}
            >
              <View />
            </IgniteProvider>
          );

          expect(fakeSetConfig).toHaveBeenCalledWith(
            'moreTicketActionsModule',
            'false'
          );
        });

        it('calls with false when moreTicketActionsModule not passed', () => {
          render(
            <IgniteProvider options={options} prebuiltModules={{}}>
              <View />
            </IgniteProvider>
          );

          expect(fakeSetConfig).toHaveBeenCalledWith(
            'moreTicketActionsModule',
            'false'
          );
        });
      });

      describe('venueDirectionsModule', () => {
        it('calls with true when venueDirectionsModule passed as true', () => {
          render(
            <IgniteProvider
              options={options}
              prebuiltModules={{ venueDirectionsModule: { enabled: true } }}
            >
              <View />
            </IgniteProvider>
          );

          expect(fakeSetConfig).toHaveBeenCalledWith(
            'venueDirectionsModule',
            'true'
          );
        });

        it('calls with false when venueDirectionsModule passed as false', () => {
          render(
            <IgniteProvider
              options={options}
              prebuiltModules={{ venueDirectionsModule: { enabled: false } }}
            >
              <View />
            </IgniteProvider>
          );

          expect(fakeSetConfig).toHaveBeenCalledWith(
            'venueDirectionsModule',
            'false'
          );
        });

        it('calls with false when venueDirectionsModule not passed', () => {
          render(
            <IgniteProvider options={options} prebuiltModules={{}}>
              <View />
            </IgniteProvider>
          );

          expect(fakeSetConfig).toHaveBeenCalledWith(
            'venueDirectionsModule',
            'false'
          );
        });
      });

      describe('seatUpgradesModule', () => {
        describe('enabled', () => {
          it('calls with true when seatUpgradesModule passed as true', () => {
            render(
              <IgniteProvider
                options={options}
                prebuiltModules={{ seatUpgradesModule: { enabled: true } }}
              >
                <View />
              </IgniteProvider>
            );

            expect(fakeSetConfig).toHaveBeenCalledWith(
              'seatUpgradesModule',
              'true'
            );
          });

          it('calls with false when seatUpgradesModule passed as false', () => {
            render(
              <IgniteProvider
                options={options}
                prebuiltModules={{ seatUpgradesModule: { enabled: false } }}
              >
                <View />
              </IgniteProvider>
            );

            expect(fakeSetConfig).toHaveBeenCalledWith(
              'seatUpgradesModule',
              'false'
            );
          });

          it('calls with false when seatUpgradesModule not passed', () => {
            render(
              <IgniteProvider options={options} prebuiltModules={{}}>
                <View />
              </IgniteProvider>
            );

            expect(fakeSetConfig).toHaveBeenCalledWith(
              'seatUpgradesModule',
              'false'
            );
          });
        });

        describe('labels', () => {
          describe('topLabelText', () => {
            it('calls with custom topLabelText for seatUpgradesModule when topLabelText passed', () => {
              render(
                <IgniteProvider
                  options={options}
                  prebuiltModules={{
                    seatUpgradesModule: {
                      enabled: false,
                      topLabelText: 'custom label',
                    },
                  }}
                >
                  <View />
                </IgniteProvider>
              );

              expect(fakeSetConfig).toHaveBeenCalledWith(
                'seatUpgradesModuleTopLabelText',
                'custom label'
              );
            });

            it('calls with empty string when topLabelText is empty string', () => {
              render(
                <IgniteProvider
                  options={options}
                  prebuiltModules={{
                    seatUpgradesModule: { enabled: false, topLabelText: '' },
                  }}
                >
                  <View />
                </IgniteProvider>
              );

              expect(fakeSetConfig).toHaveBeenCalledWith(
                'seatUpgradesModuleTopLabelText',
                ''
              );
            });

            it('does not call when label not passed', () => {
              render(
                <IgniteProvider
                  options={options}
                  prebuiltModules={{
                    seatUpgradesModule: { enabled: false },
                  }}
                >
                  <View />
                </IgniteProvider>
              );

              expect(fakeSetConfig).not.toHaveBeenCalledWith(
                'seatUpgradesModuleTopLabelText'
              );
            });

            it('does not call when seatUpgradesModule not passed', () => {
              render(
                <IgniteProvider options={options}>
                  <View />
                </IgniteProvider>
              );

              expect(fakeSetConfig).not.toHaveBeenCalledWith(
                'seatUpgradesModuleTopLabelText'
              );
            });
          });

          describe('bottomLabelText', () => {
            it('calls with custom bottomLabelText for seatUpgradesModule when bottomLabelText passed', () => {
              render(
                <IgniteProvider
                  options={options}
                  prebuiltModules={{
                    seatUpgradesModule: {
                      enabled: false,
                      bottomLabelText: 'custom label bottom',
                    },
                  }}
                >
                  <View />
                </IgniteProvider>
              );

              expect(fakeSetConfig).toHaveBeenCalledWith(
                'seatUpgradesModuleBottomLabelText',
                'custom label bottom'
              );
            });

            it('calls with empty string when bottomLabelText is empty string', () => {
              render(
                <IgniteProvider
                  options={options}
                  prebuiltModules={{
                    seatUpgradesModule: { enabled: false, bottomLabelText: '' },
                  }}
                >
                  <View />
                </IgniteProvider>
              );

              expect(fakeSetConfig).toHaveBeenCalledWith(
                'seatUpgradesModuleBottomLabelText',
                ''
              );
            });

            it('does not call when label not passed', () => {
              render(
                <IgniteProvider
                  options={options}
                  prebuiltModules={{
                    seatUpgradesModule: { enabled: false },
                  }}
                >
                  <View />
                </IgniteProvider>
              );

              expect(fakeSetConfig).not.toHaveBeenCalledWith(
                'seatUpgradesModuleBottomLabelText'
              );
            });

            it('does not call when seatUpgradesModule not passed', () => {
              render(
                <IgniteProvider options={options}>
                  <View />
                </IgniteProvider>
              );

              expect(fakeSetConfig).not.toHaveBeenCalledWith(
                'seatUpgradesModuleBottomLabelText'
              );
            });
          });
        });

        describe('image', () => {
          describe('does not call setImage', () => {
            it('when seatUpgradesModule not passed', () => {
              render(
                <IgniteProvider options={options} prebuiltModules={{}}>
                  <View />
                </IgniteProvider>
              );

              expect(fakeSetImage).not.toHaveBeenCalledWith(
                'seatUpgradesModuleImage'
              );
            });

            it('when seatUpgradesModule is passed but no image passed', () => {
              render(
                <IgniteProvider
                  options={options}
                  prebuiltModules={{ seatUpgradesModule: { enabled: true } }}
                >
                  <View />
                </IgniteProvider>
              );

              expect(fakeSetImage).not.toHaveBeenCalledWith(
                'seatUpgradesModuleImage'
              );
            });
          });

          describe.skip('calls setImage', () => {
            it('when image passed', () => {
              render(
                <IgniteProvider
                  options={options}
                  prebuiltModules={{
                    seatUpgradesModule: {
                      enabled: true,
                      image: require('./testImage.png'),
                    },
                  }}
                >
                  <View />
                </IgniteProvider>
              );

              expect(fakeSetImage).toHaveBeenCalledWith(
                'seatUpgradesModuleImage',
                { testUri: '../../../__tests__/testImage.png' }
              );
            });
          });
        });
      });

      describe('invoiceModule', () => {
        it('calls with true when invoiceModule passed as true', () => {
          render(
            <IgniteProvider
              options={options}
              prebuiltModules={{ invoiceModule: { enabled: true } }}
            >
              <View />
            </IgniteProvider>
          );

          expect(fakeSetConfig).toHaveBeenCalledWith('invoiceModule', 'true');
        });

        it('calls with false when invoiceModule passed as false', () => {
          render(
            <IgniteProvider
              options={options}
              prebuiltModules={{ invoiceModule: { enabled: false } }}
            >
              <View />
            </IgniteProvider>
          );

          expect(fakeSetConfig).toHaveBeenCalledWith('invoiceModule', 'false');
        });

        it('calls with false when invoiceModule not passed', () => {
          render(
            <IgniteProvider options={options} prebuiltModules={{}}>
              <View />
            </IgniteProvider>
          );

          expect(fakeSetConfig).toHaveBeenCalledWith('invoiceModule', 'false');
        });
      });

      describe('venueConcessionsModule', () => {
        describe('enabled', () => {
          it('calls with true when venueConcessionsModule passed as true', () => {
            render(
              <IgniteProvider
                options={options}
                prebuiltModules={{
                  venueConcessionsModule: {
                    enabled: true,
                    orderButtonCallback: jest.fn(),
                    walletButtonCallback: jest.fn(),
                  },
                }}
              >
                <View />
              </IgniteProvider>
            );

            expect(fakeSetConfig).toHaveBeenCalledWith(
              'venueConcessionsModule',
              'true'
            );
          });

          it('calls with false when venueConcessionsModule passed as false', () => {
            render(
              <IgniteProvider
                options={options}
                prebuiltModules={{
                  venueConcessionsModule: {
                    enabled: false,
                    orderButtonCallback: jest.fn(),
                    walletButtonCallback: jest.fn(),
                  },
                }}
              >
                <View />
              </IgniteProvider>
            );

            expect(fakeSetConfig).toHaveBeenCalledWith(
              'venueConcessionsModule',
              'false'
            );
          });

          it('calls with false when venueConcessionsModule not passed', () => {
            render(
              <IgniteProvider options={options} prebuiltModules={{}}>
                <View />
              </IgniteProvider>
            );

            expect(fakeSetConfig).toHaveBeenCalledWith(
              'venueConcessionsModule',
              'false'
            );
          });
        });

        describe('labels', () => {
          describe('topLabelText', () => {
            it('calls with custom topLabelText for venueConcessionsModule when topLabelText passed', () => {
              render(
                <IgniteProvider
                  options={options}
                  prebuiltModules={{
                    venueConcessionsModule: {
                      enabled: false,
                      orderButtonCallback: jest.fn(),
                      walletButtonCallback: jest.fn(),
                      topLabelText: 'custom label venue',
                    },
                  }}
                >
                  <View />
                </IgniteProvider>
              );

              expect(fakeSetConfig).toHaveBeenCalledWith(
                'venueConcessionsModuleTopLabelText',
                'custom label venue'
              );
            });

            it('calls with empty string when topLabelText is empty string', () => {
              render(
                <IgniteProvider
                  options={options}
                  prebuiltModules={{
                    venueConcessionsModule: {
                      enabled: false,
                      orderButtonCallback: jest.fn(),
                      walletButtonCallback: jest.fn(),
                      topLabelText: '',
                    },
                  }}
                >
                  <View />
                </IgniteProvider>
              );

              expect(fakeSetConfig).toHaveBeenCalledWith(
                'venueConcessionsModuleTopLabelText',
                ''
              );
            });

            it('does not call when label not passed', () => {
              render(
                <IgniteProvider
                  options={options}
                  prebuiltModules={{
                    venueConcessionsModule: {
                      enabled: false,
                      orderButtonCallback: jest.fn(),
                      walletButtonCallback: jest.fn(),
                    },
                  }}
                >
                  <View />
                </IgniteProvider>
              );

              expect(fakeSetConfig).not.toHaveBeenCalledWith(
                'venueConcessionsModuleTopLabelText'
              );
            });

            it('does not call when venueConcessionsModule not passed', () => {
              render(
                <IgniteProvider options={options}>
                  <View />
                </IgniteProvider>
              );

              expect(fakeSetConfig).not.toHaveBeenCalledWith(
                'venueConcessionsModuleTopLabelText'
              );
            });
          });

          describe('bottomLabelText', () => {
            it('calls with custom bottomLabelText for venueConcessionsModule when bottomLabelText passed', () => {
              render(
                <IgniteProvider
                  options={options}
                  prebuiltModules={{
                    venueConcessionsModule: {
                      enabled: false,
                      orderButtonCallback: jest.fn(),
                      walletButtonCallback: jest.fn(),
                      bottomLabelText: 'custom label venue bottom',
                    },
                  }}
                >
                  <View />
                </IgniteProvider>
              );

              expect(fakeSetConfig).toHaveBeenCalledWith(
                'venueConcessionsModuleBottomLabelText',
                'custom label venue bottom'
              );
            });

            it('calls with empty string when bottomLabelText is empty string', () => {
              render(
                <IgniteProvider
                  options={options}
                  prebuiltModules={{
                    venueConcessionsModule: {
                      enabled: false,
                      orderButtonCallback: jest.fn(),
                      walletButtonCallback: jest.fn(),
                      bottomLabelText: '',
                    },
                  }}
                >
                  <View />
                </IgniteProvider>
              );

              expect(fakeSetConfig).toHaveBeenCalledWith(
                'venueConcessionsModuleBottomLabelText',
                ''
              );
            });

            it('does not call when label not passed', () => {
              render(
                <IgniteProvider
                  options={options}
                  prebuiltModules={{
                    venueConcessionsModule: {
                      enabled: false,
                      orderButtonCallback: jest.fn(),
                      walletButtonCallback: jest.fn(),
                    },
                  }}
                >
                  <View />
                </IgniteProvider>
              );

              expect(fakeSetConfig).not.toHaveBeenCalledWith(
                'venueConcessionsModuleBottomLabelText'
              );
            });

            it('does not call when venueConcessionsModule not passed', () => {
              render(
                <IgniteProvider options={options}>
                  <View />
                </IgniteProvider>
              );

              expect(fakeSetConfig).not.toHaveBeenCalledWith(
                'venueConcessionsModuleBottomLabelText'
              );
            });
          });
        });

        describe('image', () => {
          describe('does not call setImage', () => {
            it('when venueConcessionsModule not passed', () => {
              render(
                <IgniteProvider options={options} prebuiltModules={{}}>
                  <View />
                </IgniteProvider>
              );

              expect(fakeSetImage).not.toHaveBeenCalledWith(
                'venueConcessionsModuleImage'
              );
            });

            it('when venueConcessionsModule is passed but no image passed', () => {
              render(
                <IgniteProvider
                  options={options}
                  prebuiltModules={{
                    venueConcessionsModule: {
                      enabled: true,
                      walletButtonCallback: jest.fn(),
                      orderButtonCallback: jest.fn(),
                    },
                  }}
                >
                  <View />
                </IgniteProvider>
              );

              expect(fakeSetImage).not.toHaveBeenCalledWith(
                'venueConcessionsModuleImage'
              );
            });
          });

          describe.skip('calls setImage', () => {
            it('when image passed', () => {
              render(
                <IgniteProvider
                  options={options}
                  prebuiltModules={{
                    venueConcessionsModule: {
                      image: require('./testImage.png'),
                      enabled: true,
                      walletButtonCallback: jest.fn(),
                      orderButtonCallback: jest.fn(),
                    },
                  }}
                >
                  <View />
                </IgniteProvider>
              );

              expect(fakeSetImage).toHaveBeenCalledWith(
                'venueConcessionsModuleImage',
                { testUri: '../../../__tests__/testImage.png' }
              );
            });
          });
        });
      });
    });
  });

  describe('calls AccountsSDK methods on render', () => {
    const fakeSetConfig = jest.fn();
    const fakeConfigureAccountsSDK = jest.fn(() =>
      Promise.resolve('configured')
    );
    const fakeIsLoggedIn = jest.fn(() => Promise.resolve());
    const fakeGetMemberInfo = jest.fn(() => Promise.resolve());

    beforeEach(() => {
      NativeModules.Config = {
        setConfig: fakeSetConfig,
      };
      NativeModules.AccountsSDK = {
        configureAccountsSDK: fakeConfigureAccountsSDK,
        isLoggedIn: fakeIsLoggedIn,
        getMemberInfo: fakeGetMemberInfo,
      };
    });

    it('calls configureAccountsSDK on render', () => {
      render(component);

      expect(fakeConfigureAccountsSDK).toHaveBeenCalled();
    });

    it('calls isLoggedIn on render', () => {
      render(component);

      expect(fakeIsLoggedIn).toHaveBeenCalled();
    });
  });

  describe('IgniteProvider context', () => {
    const Wrapper = ({ children }: { children: any }) => (
      <IgniteProvider options={options}>{children}</IgniteProvider>
    );

    describe('login', () => {
      describe('ios', () => {
        beforeEach(() => {
          Platform.OS = 'ios';
        });

        it('when login is triggered, it calls the login method on AccountsSDK', async () => {
          const fakeLogin = jest.fn(() => Promise.resolve('logged in'));
          NativeModules.AccountsSDK = {
            login: fakeLogin,
          };

          const { getByTestId } = render(
            <Wrapper>
              <IgniteContext.Consumer>
                {({ login }) => (
                  <button
                    // @ts-ignore
                    onPress={async () => {
                      await login();
                    }}
                    testID="login-button"
                  />
                )}
              </IgniteContext.Consumer>
            </Wrapper>
          );

          const loginButton = getByTestId('login-button');

          await act(async () => {
            loginButton.props.onPress();
          });

          expect(fakeLogin).toHaveBeenCalled();
        });

        describe('when AccountsSDK.login returns access token', () => {
          it('and skipUpdate is not passed - refreshes the state', async () => {
            const fakeLogin = jest.fn(() =>
              Promise.resolve({ accessToken: '123' })
            );
            const fakeIsLoggedIn = jest.fn(() =>
              Promise.resolve({ result: true })
            );
            const fakeGetMemberInfo = jest.fn(() => Promise.resolve());

            NativeModules.AccountsSDK = {
              login: fakeLogin,
              isLoggedIn: fakeIsLoggedIn,
              getMemberInfo: fakeGetMemberInfo,
            };

            const { getByTestId } = render(
              <Wrapper>
                <IgniteContext.Consumer>
                  {({ login }) => (
                    <button
                      // @ts-ignore
                      onPress={async () => {
                        await login();
                      }}
                      testID="login-button"
                    />
                  )}
                </IgniteContext.Consumer>
              </Wrapper>
            );

            const loginButton = getByTestId('login-button');

            await act(async () => {
              loginButton.props.onPress();
            });

            expect(fakeLogin).toHaveBeenCalled();
            expect(fakeGetMemberInfo).toHaveBeenCalled();
            expect(fakeIsLoggedIn).toHaveBeenCalled();
          });

          it('and skipUpdate is false - refreshes the state', async () => {
            const fakeLogin = jest.fn(() =>
              Promise.resolve({ accessToken: '123' })
            );
            const fakeIsLoggedIn = jest.fn(() =>
              Promise.resolve({ result: true })
            );
            const fakeGetMemberInfo = jest.fn(() => Promise.resolve());

            NativeModules.AccountsSDK = {
              login: fakeLogin,
              isLoggedIn: fakeIsLoggedIn,
              getMemberInfo: fakeGetMemberInfo,
            };

            const { getByTestId } = render(
              <Wrapper>
                <IgniteContext.Consumer>
                  {({ login }) => (
                    <button
                      // @ts-ignore
                      onPress={async () => {
                        await login({ skipUpdate: false });
                      }}
                      testID="login-button"
                    />
                  )}
                </IgniteContext.Consumer>
              </Wrapper>
            );

            const loginButton = getByTestId('login-button');

            await act(async () => {
              loginButton.props.onPress();
            });

            expect(fakeLogin).toHaveBeenCalled();
            expect(fakeGetMemberInfo).toHaveBeenCalled();
            expect(fakeIsLoggedIn).toHaveBeenCalled();
          });

          it('and skipUpdate is true - does not refresh the state', async () => {
            const fakeLogin = jest.fn(() =>
              Promise.resolve({ accessToken: '123' })
            );
            const fakeIsLoggedIn = jest.fn(() =>
              Promise.resolve({ result: true })
            );
            const fakeGetMemberInfo = jest.fn(() => Promise.resolve());

            NativeModules.AccountsSDK = {
              login: fakeLogin,
              isLoggedIn: fakeIsLoggedIn,
              getMemberInfo: fakeGetMemberInfo,
            };

            const { getByTestId } = render(
              <Wrapper>
                <IgniteContext.Consumer>
                  {({ login }) => (
                    <button
                      // @ts-ignore
                      onPress={async () => {
                        await login({ skipUpdate: true });
                      }}
                      testID="login-button"
                    />
                  )}
                </IgniteContext.Consumer>
              </Wrapper>
            );

            const loginButton = getByTestId('login-button');

            await act(async () => {
              loginButton.props.onPress();
            });

            expect(fakeLogin).toHaveBeenCalled();
            expect(fakeGetMemberInfo).not.toHaveBeenCalled();
            expect(fakeIsLoggedIn).not.toHaveBeenCalled();
          });
        });

        it('when AccountsSDK.login does not return access token, does not refresh the state', async () => {
          const fakeLogin = jest.fn(() => Promise.resolve({ result: null }));
          const fakeIsLoggedIn = jest.fn(() =>
            Promise.resolve({ result: true })
          );
          const fakeGetMemberInfo = jest.fn(() => Promise.resolve());

          NativeModules.AccountsSDK = {
            login: fakeLogin,
            isLoggedIn: fakeIsLoggedIn,
            getMemberInfo: fakeGetMemberInfo,
          };

          const { getByTestId } = render(
            <Wrapper>
              <IgniteContext.Consumer>
                {({ login }) => (
                  <button
                    // @ts-ignore
                    onPress={async () => {
                      await login();
                    }}
                    testID="login-button"
                  />
                )}
              </IgniteContext.Consumer>
            </Wrapper>
          );

          const loginButton = getByTestId('login-button');

          await act(async () => {
            loginButton.props.onPress();
          });

          expect(fakeLogin).toHaveBeenCalled();
          await waitFor(() => {
            expect(fakeGetMemberInfo).not.toHaveBeenCalled();
            expect(fakeIsLoggedIn).not.toHaveBeenCalled();
          });
        });
      });

      describe('android', () => {
        beforeEach(() => {
          Platform.OS = 'android';
        });

        it('when login is triggered, it calls the login method on AccountsSDK', async () => {
          const fakeLogin = jest.fn(() => Promise.resolve('logged in'));
          NativeModules.AccountsSDK = {
            login: fakeLogin,
          };

          const { getByTestId } = render(
            <Wrapper>
              <IgniteContext.Consumer>
                {({ login }) => (
                  <button
                    // @ts-ignore
                    onPress={async () => {
                      await login();
                    }}
                    testID="login-button"
                  />
                )}
              </IgniteContext.Consumer>
            </Wrapper>
          );

          const loginButton = getByTestId('login-button');

          await act(async () => {
            loginButton.props.onPress();
          });

          expect(fakeLogin).toHaveBeenCalled();
        });

        describe('when Accounts.SDK returns a code for success (-1)', () => {
          it('and skipUpdate is not passed - refreshes the state', async () => {
            const fakeLogin = jest.fn((callback) => callback(-1));
            const fakeIsLoggedIn = jest.fn(() => Promise.resolve(true));
            const fakeGetMemberInfo = jest.fn(() =>
              Promise.resolve('{"name":"Some Name"}')
            );
            NativeModules.Config = {
              setConfig: jest.fn(),
            };

            NativeModules.AccountsSDK = {
              login: fakeLogin,
              isLoggedIn: fakeIsLoggedIn,
              getMemberInfo: fakeGetMemberInfo,
            };

            const { getByTestId } = render(
              <Wrapper>
                <IgniteContext.Consumer>
                  {({ login }) => (
                    <button
                      // @ts-ignore
                      onPress={async () => {
                        await login();
                      }}
                      testID="login-button"
                    />
                  )}
                </IgniteContext.Consumer>
              </Wrapper>
            );

            const loginButton = getByTestId('login-button');

            await act(async () => {
              loginButton.props.onPress();
            });

            expect(fakeLogin).toHaveBeenCalled();
            expect(fakeGetMemberInfo).toHaveBeenCalled();
            expect(fakeIsLoggedIn).toHaveBeenCalled();
          });

          it('and skipUpdate is false - refreshes the state', async () => {
            const fakeLogin = jest.fn((callback) => callback(-1));
            const fakeIsLoggedIn = jest.fn(() => Promise.resolve(true));
            const fakeGetMemberInfo = jest.fn(() =>
              Promise.resolve('{"name":"Some Name"}')
            );
            NativeModules.Config = {
              setConfig: jest.fn(),
            };

            NativeModules.AccountsSDK = {
              login: fakeLogin,
              isLoggedIn: fakeIsLoggedIn,
              getMemberInfo: fakeGetMemberInfo,
            };

            const { getByTestId } = render(
              <Wrapper>
                <IgniteContext.Consumer>
                  {({ login }) => (
                    <button
                      // @ts-ignore
                      onPress={async () => {
                        await login({ skipUpdate: false });
                      }}
                      testID="login-button"
                    />
                  )}
                </IgniteContext.Consumer>
              </Wrapper>
            );

            const loginButton = getByTestId('login-button');

            await act(async () => {
              loginButton.props.onPress();
            });

            expect(fakeLogin).toHaveBeenCalled();
            expect(fakeGetMemberInfo).toHaveBeenCalled();
            expect(fakeIsLoggedIn).toHaveBeenCalled();
          });

          it('and skipUpdate is true - does not refresh the state', async () => {
            const fakeLogin = jest.fn((callback) => callback(-1));
            const fakeIsLoggedIn = jest.fn(() => Promise.resolve(true));
            const fakeGetMemberInfo = jest.fn(() =>
              Promise.resolve('{"name":"Some Name"}')
            );
            NativeModules.Config = {
              setConfig: jest.fn(),
            };

            NativeModules.AccountsSDK = {
              login: fakeLogin,
              isLoggedIn: fakeIsLoggedIn,
              getMemberInfo: fakeGetMemberInfo,
            };

            const { getByTestId } = render(
              <Wrapper>
                <IgniteContext.Consumer>
                  {({ login }) => (
                    <button
                      // @ts-ignore
                      onPress={async () => {
                        await login({ skipUpdate: true });
                      }}
                      testID="login-button"
                    />
                  )}
                </IgniteContext.Consumer>
              </Wrapper>
            );

            const loginButton = getByTestId('login-button');

            await act(async () => {
              loginButton.props.onPress();
            });

            expect(fakeLogin).toHaveBeenCalled();
            expect(fakeGetMemberInfo).not.toHaveBeenCalled();
            expect(fakeIsLoggedIn).not.toHaveBeenCalled();
          });
        });

        it('when resultCode is not -1, does not refresh the state', async () => {
          const fakeLogin = jest.fn((callback) => callback(0));
          const fakeIsLoggedIn = jest.fn(() => Promise.resolve(true));
          const fakeGetMemberInfo = jest.fn(() =>
            Promise.resolve('{"name":"Some Name"}')
          );
          NativeModules.Config = {
            setConfig: jest.fn(),
          };

          NativeModules.AccountsSDK = {
            login: fakeLogin,
            isLoggedIn: fakeIsLoggedIn,
            getMemberInfo: fakeGetMemberInfo,
          };

          const { getByTestId } = render(
            <Wrapper>
              <IgniteContext.Consumer>
                {({ login }) => (
                  <button
                    // @ts-ignore
                    onPress={async () => {
                      await login();
                    }}
                    testID="login-button"
                  />
                )}
              </IgniteContext.Consumer>
            </Wrapper>
          );

          const loginButton = getByTestId('login-button');

          await act(async () => {
            loginButton.props.onPress();
          });

          expect(fakeLogin).toHaveBeenCalled();
          expect(fakeGetMemberInfo).not.toHaveBeenCalled();
          expect(fakeIsLoggedIn).not.toHaveBeenCalled();
        });
      });
    });

    describe('logout', () => {
      describe('when logout is triggered', () => {
        it('calls the logout method on AccountsSDK', async () => {
          const fakeIsLoggedIn = jest.fn(() => Promise.resolve(true));
          const fakeLogout = jest.fn(() => Promise.resolve('logged out'));
          const fakeGetMemberInfo = jest.fn(() =>
            Promise.resolve('{"name":"Some Name"}')
          );
          NativeModules.AccountsSDK = {
            logout: fakeLogout,
            isLoggedIn: fakeIsLoggedIn,
            getMemberInfo: fakeGetMemberInfo,
          };

          const { getByTestId } = render(
            <Wrapper>
              <IgniteContext.Consumer>
                {({ logout }) => (
                  <button
                    // @ts-ignore
                    onPress={async () => {
                      await logout();
                    }}
                    testID="logout-button"
                  />
                )}
              </IgniteContext.Consumer>
            </Wrapper>
          );

          const logoutButton = getByTestId('logout-button');

          await act(async () => {
            logoutButton.props.onPress();
          });

          expect(fakeLogout).toHaveBeenCalled();
        });

        it('when skipUpdate is not passed - refreshes the state', async () => {
          const fakeIsLoggedIn = jest.fn(() => Promise.resolve(true));
          const fakeLogout = jest.fn(() => Promise.resolve('logged out'));
          const fakeGetMemberInfo = jest.fn(() =>
            Promise.resolve('{"name":"Some Name"}')
          );
          NativeModules.AccountsSDK = {
            logout: fakeLogout,
            isLoggedIn: fakeIsLoggedIn,
            getMemberInfo: fakeGetMemberInfo,
          };

          const { getByTestId } = render(
            <Wrapper>
              <IgniteContext.Consumer>
                {({ logout }) => (
                  <button
                    // @ts-ignore
                    onPress={async () => {
                      await logout();
                    }}
                    testID="logout-button"
                  />
                )}
              </IgniteContext.Consumer>
            </Wrapper>
          );

          const logoutButton = getByTestId('logout-button');

          await act(async () => {
            logoutButton.props.onPress();
          });

          expect(fakeLogout).toHaveBeenCalled();
          expect(fakeGetMemberInfo).toHaveBeenCalled();
          expect(fakeIsLoggedIn).toHaveBeenCalled();
        });

        it('when skipUpdate is false - refreshes the state', async () => {
          const fakeIsLoggedIn = jest.fn(() => Promise.resolve(true));
          const fakeLogout = jest.fn(() => Promise.resolve('logged out'));
          const fakeGetMemberInfo = jest.fn(() =>
            Promise.resolve('{"name":"Some Name"}')
          );
          NativeModules.AccountsSDK = {
            logout: fakeLogout,
            isLoggedIn: fakeIsLoggedIn,
            getMemberInfo: fakeGetMemberInfo,
          };

          const { getByTestId } = render(
            <Wrapper>
              <IgniteContext.Consumer>
                {({ logout }) => (
                  <button
                    // @ts-ignore
                    onPress={async () => {
                      await logout({ skipUpdate: false });
                    }}
                    testID="logout-button"
                  />
                )}
              </IgniteContext.Consumer>
            </Wrapper>
          );

          const logoutButton = getByTestId('logout-button');

          await act(async () => {
            logoutButton.props.onPress();
          });

          expect(fakeLogout).toHaveBeenCalled();
          expect(fakeGetMemberInfo).toHaveBeenCalled();
          expect(fakeIsLoggedIn).toHaveBeenCalled();
        });

        it('when skipUpdate is true - does not refresh the state', async () => {
          const fakeIsLoggedIn = jest.fn(() => Promise.resolve(true));
          const fakeLogout = jest.fn(() => Promise.resolve('logged out'));
          const fakeGetMemberInfo = jest.fn(() =>
            Promise.resolve('{"name":"Some Name"}')
          );
          NativeModules.AccountsSDK = {
            logout: fakeLogout,
            isLoggedIn: fakeIsLoggedIn,
            getMemberInfo: fakeGetMemberInfo,
          };

          const { getByTestId } = render(
            <Wrapper>
              <IgniteContext.Consumer>
                {({ logout }) => (
                  <button
                    // @ts-ignore
                    onPress={async () => {
                      await logout({ skipUpdate: true });
                    }}
                    testID="logout-button"
                  />
                )}
              </IgniteContext.Consumer>
            </Wrapper>
          );

          const logoutButton = getByTestId('logout-button');

          await act(async () => {
            logoutButton.props.onPress();
          });

          expect(fakeLogout).toHaveBeenCalled();
          expect(fakeGetMemberInfo).not.toHaveBeenCalled();
          expect(fakeIsLoggedIn).not.toHaveBeenCalled();
        });
      });
    });

    describe('getIsLoggedIn', () => {
      describe('ios', () => {
        beforeEach(() => {
          Platform.OS = 'ios';
        });

        it('returns true when isLoggedIn on AccountsSDK gives true', async () => {
          const fakeIsLoggedIn = jest.fn(() =>
            Promise.resolve({ result: true })
          );
          NativeModules.AccountsSDK = {
            isLoggedIn: fakeIsLoggedIn,
          };

          let isLoggedInStatus;

          const { getByTestId } = render(
            <Wrapper>
              <IgniteContext.Consumer>
                {({ getIsLoggedIn }) => (
                  <button
                    // @ts-ignore
                    onPress={async () => {
                      isLoggedInStatus = await getIsLoggedIn();
                    }}
                    testID="islogin-button"
                  />
                )}
              </IgniteContext.Consumer>
            </Wrapper>
          );

          const isLoggedInButton = getByTestId('islogin-button');

          await act(async () => {
            isLoggedInButton.props.onPress();
          });

          expect(fakeIsLoggedIn).toHaveBeenCalled();
          expect(isLoggedInStatus).toEqual(true);
        });

        it('returns false when isLoggedIn on AccountsSDK gives false', async () => {
          const fakeIsLoggedIn = jest.fn(() =>
            Promise.resolve({ result: false })
          );
          NativeModules.AccountsSDK = {
            isLoggedIn: fakeIsLoggedIn,
          };

          let isLoggedInStatus;

          const { getByTestId } = render(
            <Wrapper>
              <IgniteContext.Consumer>
                {({ getIsLoggedIn }) => (
                  <button
                    // @ts-ignore
                    onPress={async () => {
                      isLoggedInStatus = await getIsLoggedIn();
                    }}
                    testID="islogin-button"
                  />
                )}
              </IgniteContext.Consumer>
            </Wrapper>
          );

          const isLoggedInButton = getByTestId('islogin-button');

          await act(async () => {
            isLoggedInButton.props.onPress();
          });

          expect(fakeIsLoggedIn).toHaveBeenCalled();
          expect(isLoggedInStatus).toEqual(false);
        });
      });

      describe('android', () => {
        beforeEach(() => {
          Platform.OS = 'android';
        });

        it('returns true when isLoggedIn on AccountsSDK gives true', async () => {
          const fakeIsLoggedIn = jest.fn(() => Promise.resolve(true));
          NativeModules.AccountsSDK = {
            isLoggedIn: fakeIsLoggedIn,
          };

          let isLoggedInStatus;

          const { getByTestId } = render(
            <Wrapper>
              <IgniteContext.Consumer>
                {({ getIsLoggedIn }) => (
                  <button
                    // @ts-ignore
                    onPress={async () => {
                      isLoggedInStatus = await getIsLoggedIn();
                    }}
                    testID="islogin-button"
                  />
                )}
              </IgniteContext.Consumer>
            </Wrapper>
          );

          const isLoggedInButton = getByTestId('islogin-button');

          await act(async () => {
            isLoggedInButton.props.onPress();
          });

          expect(fakeIsLoggedIn).toHaveBeenCalled();
          expect(isLoggedInStatus).toEqual(true);
        });

        it('returns false when isLoggedIn on AccountsSDK gives false', async () => {
          const fakeIsLoggedIn = jest.fn(() => Promise.resolve(false));
          NativeModules.AccountsSDK = {
            isLoggedIn: fakeIsLoggedIn,
          };

          let isLoggedInStatus;

          const { getByTestId } = render(
            <Wrapper>
              <IgniteContext.Consumer>
                {({ getIsLoggedIn }) => (
                  <button
                    // @ts-ignore
                    onPress={async () => {
                      isLoggedInStatus = await getIsLoggedIn();
                    }}
                    testID="islogin-button"
                  />
                )}
              </IgniteContext.Consumer>
            </Wrapper>
          );

          const isLoggedInButton = getByTestId('islogin-button');

          await act(async () => {
            isLoggedInButton.props.onPress();
          });

          expect(fakeIsLoggedIn).toHaveBeenCalled();
          expect(isLoggedInStatus).toEqual(false);
        });
      });
    });

    describe('getToken', () => {
      describe('ios', () => {
        beforeEach(() => {
          Platform.OS = 'ios';
        });

        it('returns the access token', async () => {
          const fakeGetToken = jest.fn(() =>
            Promise.resolve({ accessToken: '123' })
          );
          NativeModules.AccountsSDK = {
            getToken: fakeGetToken,
          };

          let accessToken;

          const { getByTestId } = render(
            <Wrapper>
              <IgniteContext.Consumer>
                {({ getToken }) => (
                  <button
                    // @ts-ignore
                    onPress={async () => {
                      accessToken = await getToken();
                    }}
                    testID="token-button"
                  />
                )}
              </IgniteContext.Consumer>
            </Wrapper>
          );

          const tokenButton = getByTestId('token-button');

          await act(async () => {
            tokenButton.props.onPress();
          });

          expect(fakeGetToken).toHaveBeenCalled();
          expect(accessToken).toEqual('123');
        });
      });

      describe('android', () => {
        beforeEach(() => {
          Platform.OS = 'android';
        });

        it('returns the access token', async () => {
          const fakeRefreshToken = jest.fn(() => Promise.resolve('111'));
          NativeModules.AccountsSDK = {
            refreshToken: fakeRefreshToken,
          };

          let accessToken;

          const { getByTestId } = render(
            <Wrapper>
              <IgniteContext.Consumer>
                {({ refreshToken }) => (
                  <button
                    // @ts-ignore
                    onPress={async () => {
                      accessToken = await refreshToken();
                    }}
                    testID="token-button"
                  />
                )}
              </IgniteContext.Consumer>
            </Wrapper>
          );

          const tokenButton = getByTestId('token-button');

          await act(async () => {
            tokenButton.props.onPress();
          });

          expect(fakeRefreshToken).toHaveBeenCalled();
          expect(accessToken).toEqual('111');
        });
      });
    });

    describe('getMemberInfo', () => {
      describe('ios', () => {
        it('returns member info', async () => {
          Platform.OS = 'ios';

          const fakeGetMemberInfo = jest.fn(() => Promise.resolve('info'));
          NativeModules.AccountsSDK = {
            getMemberInfo: fakeGetMemberInfo,
          };

          let memberInfo;

          const { getByTestId } = render(
            <Wrapper>
              <IgniteContext.Consumer>
                {({ getMemberInfo }) => (
                  <button
                    // @ts-ignore
                    onPress={async () => {
                      memberInfo = await getMemberInfo();
                    }}
                    testID="memberInfo-button"
                  />
                )}
              </IgniteContext.Consumer>
            </Wrapper>
          );

          const isLoggedInButton = getByTestId('memberInfo-button');

          await act(async () => {
            isLoggedInButton.props.onPress();
          });

          expect(fakeGetMemberInfo).toHaveBeenCalled();
          expect(memberInfo).toEqual('info');
        });
      });

      describe('android', () => {
        it('returns member info', async () => {
          Platform.OS = 'android';

          const fakeGetMemberInfo = jest.fn(() =>
            Promise.resolve('{"name":"Some Name"}')
          );
          NativeModules.AccountsSDK = {
            getMemberInfo: fakeGetMemberInfo,
          };

          let memberInfo;

          const { getByTestId } = render(
            <Wrapper>
              <IgniteContext.Consumer>
                {({ getMemberInfo }) => (
                  <button
                    // @ts-ignore
                    onPress={async () => {
                      memberInfo = await getMemberInfo();
                    }}
                    testID="memberInfo-button"
                  />
                )}
              </IgniteContext.Consumer>
            </Wrapper>
          );

          const isLoggedInButton = getByTestId('memberInfo-button');

          await act(async () => {
            isLoggedInButton.props.onPress();
          });

          expect(fakeGetMemberInfo).toHaveBeenCalled();
          expect(memberInfo).toEqual({ name: 'Some Name' });
        });
      });
    });

    describe('refreshToken', () => {
      describe('ios', () => {
        it('returns a token', async () => {
          Platform.OS = 'ios';
          const fakeRefreshToken = jest.fn(() =>
            Promise.resolve({ accessToken: '909' })
          );
          NativeModules.AccountsSDK = {
            refreshToken: fakeRefreshToken,
          };

          let token;

          const { getByTestId } = render(
            <Wrapper>
              <IgniteContext.Consumer>
                {({ refreshToken }) => (
                  <button
                    // @ts-ignore
                    onPress={async () => {
                      token = await refreshToken();
                    }}
                    testID="token-button"
                  />
                )}
              </IgniteContext.Consumer>
            </Wrapper>
          );

          const tokenButton = getByTestId('token-button');

          await act(async () => {
            tokenButton.props.onPress();
          });

          expect(fakeRefreshToken).toHaveBeenCalled();
          expect(token).toEqual('909');
        });
      });

      describe('android', () => {
        it('returns a token', async () => {
          Platform.OS = 'android';
          const fakeRefreshToken = jest.fn(() => Promise.resolve('909'));
          NativeModules.AccountsSDK = {
            refreshToken: fakeRefreshToken,
          };

          let token;

          const { getByTestId } = render(
            <Wrapper>
              <IgniteContext.Consumer>
                {({ refreshToken }) => (
                  <button
                    // @ts-ignore
                    onPress={async () => {
                      token = await refreshToken();
                    }}
                    testID="token-button"
                  />
                )}
              </IgniteContext.Consumer>
            </Wrapper>
          );

          const tokenButton = getByTestId('token-button');

          await act(async () => {
            tokenButton.props.onPress();
          });

          expect(fakeRefreshToken).toHaveBeenCalled();
          expect(token).toEqual('909');
        });
      });
    });
  });
});
