import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { View, Platform } from 'react-native';
import { IgniteProvider } from '../src';
import { IgniteContext } from '../src/IgniteProvider';
import NativeConfig from '../specs/NativeConfig';
import NativeAccountsSdk from '../specs/NativeAccountsSdk';

// Mock transitive spec imports from src/index.tsx
jest.mock('../specs/NativeRetailSdk', () => ({
  __esModule: true,
  default: {
    presentPrePurchaseAttraction: jest.fn(),
    presentPrePurchaseVenue: jest.fn(),
    presentPurchase: jest.fn(),
  },
}));

jest.mock('../specs/NativeConfig', () => ({
  __esModule: true,
  default: {
    setConfig: jest.fn(),
    setImage: jest.fn(),
  },
}));

jest.mock('../specs/NativeAccountsSdk', () => ({
  __esModule: true,
  default: {
    configureAccountsSDK: jest.fn(() => Promise.resolve()),
    login: jest.fn(() => Promise.resolve({})),
    logout: jest.fn(() => Promise.resolve()),
    logoutAll: jest.fn(() => Promise.resolve()),
    isLoggedIn: jest.fn(() => Promise.resolve(false)),
    getMemberInfo: jest.fn(() => Promise.resolve({})),
    getToken: jest.fn(() => Promise.resolve(null)),
    refreshToken: jest.fn(() => Promise.resolve(null)),
    getSportXRData: jest.fn(() => Promise.resolve(null)),
  },
}));

const mockNativeConfig = NativeConfig as jest.Mocked<typeof NativeConfig>;
const mockNativeAccountsSdk = NativeAccountsSdk as jest.Mocked<
  typeof NativeAccountsSdk
>;

/**
 * Helper function that renders a component and waits for it to finish loading.
 * After the component is fully loaded, it resets all mock function call history
 * so that tests only check for actions that happen after the initial setup.
 */
async function renderAndFlush(ui: React.ReactElement) {
  const result = render(ui);
  await act(async () => {});
  jest.clearAllMocks();
  return result;
}

describe('IgniteProvider', () => {
  const mockApiKey = 'AAA';
  const mockClientName = 'SomeName';
  const mockPrimaryColor = '#FF0000';
  const options = {
    apiKey: mockApiKey,
    clientName: mockClientName,
    primaryColor: mockPrimaryColor,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
    jest.spyOn(console, 'error').mockImplementation(jest.fn());

    // Re-set default implementations after clearAllMocks
    mockNativeAccountsSdk.configureAccountsSDK.mockResolvedValue(undefined);
    mockNativeAccountsSdk.isLoggedIn.mockResolvedValue(false);
    mockNativeAccountsSdk.getMemberInfo.mockResolvedValue({});
    mockNativeAccountsSdk.login.mockResolvedValue({});
    mockNativeAccountsSdk.logout.mockResolvedValue(undefined);
    mockNativeAccountsSdk.logoutAll.mockResolvedValue(undefined);
    mockNativeAccountsSdk.getToken.mockResolvedValue(null);
    mockNativeAccountsSdk.refreshToken.mockResolvedValue(null);
    mockNativeAccountsSdk.getSportXRData.mockResolvedValue(null);
  });

  const component = (
    <IgniteProvider options={options}>
      <View />
    </IgniteProvider>
  );

  describe('Native Config', () => {
    it('calls with the API key when provided', () => {
      render(component);

      expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
        'apiKey',
        mockApiKey
      );
    });

    it('calls with the client name when provided', () => {
      render(component);

      expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
        'clientName',
        mockClientName
      );
    });

    it('calls with the primary color when provided', () => {
      render(component);

      expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
        'primaryColor',
        mockPrimaryColor
      );
    });

    describe('region', () => {
      it('calls with the custom region when provided', () => {
        render(
          <IgniteProvider options={{ ...options, region: 'UK' }}>
            <View />
          </IgniteProvider>
        );

        expect(mockNativeConfig.setConfig).toHaveBeenCalledWith('region', 'UK');
      });

      it('calls with US when no custom region is provided', () => {
        render(component);

        expect(mockNativeConfig.setConfig).toHaveBeenCalledWith('region', 'US');
      });
    });

    describe('market domain', () => {
      it('calls with the market domain when provided', () => {
        render(
          <IgniteProvider options={{ ...options, marketDomain: 'UK' }}>
            <View />
          </IgniteProvider>
        );

        expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
          'marketDomain',
          'UK'
        );
      });

      it('calls with US when no market domain is provided', () => {
        render(component);

        expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
          'marketDomain',
          'US'
        );
      });
    });

    describe('eventHeaderType', () => {
      it('calls with the custom eventHeaderType when provided', () => {
        render(
          <IgniteProvider
            options={{ ...options, eventHeaderType: 'EVENT_INFO' }}
          >
            <View />
          </IgniteProvider>
        );

        expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
          'eventHeaderType',
          'EVENT_INFO'
        );
      });

      it('calls with the EVENT_INFO_SHARE eventHeaderType when no eventHeaderType is provided', () => {
        render(component);

        expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
          'eventHeaderType',
          'EVENT_INFO_SHARE'
        );
      });
    });

    describe('prebuiltModules', () => {
      describe('moreTicketActionsModule', () => {
        it('calls with moreTicketActionsModule enabled when true is provided', () => {
          render(
            <IgniteProvider
              options={options}
              prebuiltModules={{ moreTicketActionsModule: { enabled: true } }}
            >
              <View />
            </IgniteProvider>
          );

          expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
            'moreTicketActionsModule',
            'true'
          );
        });

        it('calls with moreTicketActionsModule disabled when false is provided', () => {
          render(
            <IgniteProvider
              options={options}
              prebuiltModules={{ moreTicketActionsModule: { enabled: false } }}
            >
              <View />
            </IgniteProvider>
          );

          expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
            'moreTicketActionsModule',
            'false'
          );
        });

        it('calls with moreTicketActionsModule disabled when moreTicketActionsModule is not provided', () => {
          render(component);

          expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
            'moreTicketActionsModule',
            'false'
          );
        });
      });

      describe('venueDirectionsModule', () => {
        it('calls with venueDirectionsModule enabled when true is provided', () => {
          render(
            <IgniteProvider
              options={options}
              prebuiltModules={{ venueDirectionsModule: { enabled: true } }}
            >
              <View />
            </IgniteProvider>
          );

          expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
            'venueDirectionsModule',
            'true'
          );
        });

        it('calls with venueDirectionsModule disabled when false is provided', () => {
          render(
            <IgniteProvider
              options={options}
              prebuiltModules={{ venueDirectionsModule: { enabled: false } }}
            >
              <View />
            </IgniteProvider>
          );

          expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
            'venueDirectionsModule',
            'false'
          );
        });

        it('calls with venueDirectionsModule disabled when venueDirectionsModule is not provided', () => {
          render(component);

          expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
            'venueDirectionsModule',
            'false'
          );
        });
      });

      describe('seatUpgradesModule', () => {
        describe('enabled', () => {
          it('calls with seatUpgradesModule enabled when true is provided', () => {
            render(
              <IgniteProvider
                options={options}
                prebuiltModules={{ seatUpgradesModule: { enabled: true } }}
              >
                <View />
              </IgniteProvider>
            );

            expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
              'seatUpgradesModule',
              'true'
            );
          });

          it('calls with seatUpgradesModule disabled when false is provided', () => {
            render(
              <IgniteProvider
                options={options}
                prebuiltModules={{ seatUpgradesModule: { enabled: false } }}
              >
                <View />
              </IgniteProvider>
            );

            expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
              'seatUpgradesModule',
              'false'
            );
          });

          it('calls with seatUpgradesModule disabled when seatUpgradesModule is not provided', () => {
            render(component);

            expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
              'seatUpgradesModule',
              'false'
            );
          });
        });

        describe('labels', () => {
          describe('topLabelText', () => {
            it('calls with custom topLabelText for seatUpgradesModule when topLabelText provided', () => {
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

              expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
                'seatUpgradesModuleTopLabelText',
                'custom label'
              );
            });

            it('calls with empty string when topLabelText is empty string', () => {
              render(
                <IgniteProvider
                  options={options}
                  prebuiltModules={{
                    seatUpgradesModule: {
                      enabled: false,
                      topLabelText: '',
                    },
                  }}
                >
                  <View />
                </IgniteProvider>
              );

              expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
                'seatUpgradesModuleTopLabelText',
                ''
              );
            });

            it('does not call when label not provided', () => {
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

              expect(mockNativeConfig.setConfig).not.toHaveBeenCalledWith(
                'seatUpgradesModuleTopLabelText'
              );
            });

            it('does not call when seatUpgradesModule not provided', () => {
              render(
                <IgniteProvider options={options}>
                  <View />
                </IgniteProvider>
              );

              expect(mockNativeConfig.setConfig).not.toHaveBeenCalledWith(
                'seatUpgradesModuleTopLabelText'
              );
            });
          });

          describe('bottomLabelText', () => {
            it('calls with custom bottomLabelText for seatUpgradesModule when bottomLabelText provided', () => {
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

              expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
                'seatUpgradesModuleBottomLabelText',
                'custom label bottom'
              );
            });

            it('calls with empty string when bottomLabelText is empty string', () => {
              render(
                <IgniteProvider
                  options={options}
                  prebuiltModules={{
                    seatUpgradesModule: {
                      enabled: false,
                      bottomLabelText: '',
                    },
                  }}
                >
                  <View />
                </IgniteProvider>
              );

              expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
                'seatUpgradesModuleBottomLabelText',
                ''
              );
            });

            it('does not call when label not provided', () => {
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

              expect(mockNativeConfig.setConfig).not.toHaveBeenCalledWith(
                'seatUpgradesModuleBottomLabelText'
              );
            });

            it('does not call when seatUpgradesModule not provided', () => {
              render(
                <IgniteProvider options={options}>
                  <View />
                </IgniteProvider>
              );

              expect(mockNativeConfig.setConfig).not.toHaveBeenCalledWith(
                'seatUpgradesModuleBottomLabelText'
              );
            });
          });
        });

        describe('image', () => {
          describe('does not call setImage', () => {
            it('when seatUpgradesModule not provided', () => {
              render(
                <IgniteProvider options={options} prebuiltModules={{}}>
                  <View />
                </IgniteProvider>
              );

              expect(mockNativeConfig.setImage).not.toHaveBeenCalledWith(
                'seatUpgradesModuleImage'
              );
            });

            it('when seatUpgradesModule is provided but no image provided', () => {
              render(
                <IgniteProvider
                  options={options}
                  prebuiltModules={{
                    seatUpgradesModule: { enabled: true },
                  }}
                >
                  <View />
                </IgniteProvider>
              );

              expect(mockNativeConfig.setImage).not.toHaveBeenCalledWith(
                'seatUpgradesModuleImage'
              );
            });
          });

          describe.skip('calls setImage', () => {
            it('when image provided', () => {
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

              expect(mockNativeConfig.setImage).toHaveBeenCalledWith(
                'seatUpgradesModuleImage',
                expect.any(String)
              );
            });
          });
        });
      });

      describe('invoiceModule', () => {
        it('calls with invoiceModule enabled when true is provided', () => {
          render(
            <IgniteProvider
              options={options}
              prebuiltModules={{ invoiceModule: { enabled: true } }}
            >
              <View />
            </IgniteProvider>
          );

          expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
            'invoiceModule',
            'true'
          );
        });

        it('calls with invoiceModule disabled when false is provided', () => {
          render(
            <IgniteProvider
              options={options}
              prebuiltModules={{ invoiceModule: { enabled: false } }}
            >
              <View />
            </IgniteProvider>
          );

          expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
            'invoiceModule',
            'false'
          );
        });

        it('calls with invoiceModule disabled when invoiceModule is not provided', () => {
          render(component);

          expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
            'invoiceModule',
            'false'
          );
        });
      });

      describe('venueConcessionsModule', () => {
        describe('enabled', () => {
          it('calls with venueConcessionsModule enabled when true is provided', () => {
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

            expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
              'venueConcessionsModule',
              'true'
            );
          });

          it('calls with venueConcessionsModule disabled when false is provided', () => {
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

            expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
              'venueConcessionsModule',
              'false'
            );
          });

          it('calls with venueConcessionsModule disabled when venueConcessionsModule is not provided', () => {
            render(component);

            expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
              'venueConcessionsModule',
              'false'
            );
          });
        });

        describe('labels', () => {
          describe('topLabelText', () => {
            it('calls with custom topLabelText for venueConcessionsModule when topLabelText provided', () => {
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

              expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
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

              expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
                'venueConcessionsModuleTopLabelText',
                ''
              );
            });

            it('does not call when label not provided', () => {
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

              expect(mockNativeConfig.setConfig).not.toHaveBeenCalledWith(
                'venueConcessionsModuleTopLabelText'
              );
            });

            it('does not call when venueConcessionsModule not provided', () => {
              render(
                <IgniteProvider options={options}>
                  <View />
                </IgniteProvider>
              );

              expect(mockNativeConfig.setConfig).not.toHaveBeenCalledWith(
                'venueConcessionsModuleTopLabelText'
              );
            });
          });

          describe('bottomLabelText', () => {
            it('calls with custom bottomLabelText for venueConcessionsModule when bottomLabelText provided', () => {
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

              expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
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

              expect(mockNativeConfig.setConfig).toHaveBeenCalledWith(
                'venueConcessionsModuleBottomLabelText',
                ''
              );
            });

            it('does not call when label not provided', () => {
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

              expect(mockNativeConfig.setConfig).not.toHaveBeenCalledWith(
                'venueConcessionsModuleBottomLabelText'
              );
            });

            it('does not call when venueConcessionsModule not provided', () => {
              render(
                <IgniteProvider options={options}>
                  <View />
                </IgniteProvider>
              );

              expect(mockNativeConfig.setConfig).not.toHaveBeenCalledWith(
                'venueConcessionsModuleBottomLabelText'
              );
            });
          });
        });

        describe('image', () => {
          describe('does not call setImage', () => {
            it('when venueConcessionsModule not provided', () => {
              render(
                <IgniteProvider options={options} prebuiltModules={{}}>
                  <View />
                </IgniteProvider>
              );

              expect(mockNativeConfig.setImage).not.toHaveBeenCalledWith(
                'venueConcessionsModuleImage'
              );
            });

            it('when venueConcessionsModule is provided but no image provided', () => {
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

              expect(mockNativeConfig.setImage).not.toHaveBeenCalledWith(
                'venueConcessionsModuleImage'
              );
            });
          });

          describe.skip('calls setImage', () => {
            it('when image provided', () => {
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

              expect(mockNativeConfig.setImage).toHaveBeenCalledWith(
                'venueConcessionsModuleImage',
                expect.any(String)
              );
            });
          });
        });
      });
    });
  });

  describe('NativeAccountsSdk', () => {
    it('calls configureAccountsSdk on render', () => {
      render(component);

      expect(mockNativeAccountsSdk.configureAccountsSDK).toHaveBeenCalled();
    });

    it('calls isLoggedIn on render', async () => {
      render(component);

      await waitFor(() => {
        expect(mockNativeAccountsSdk.isLoggedIn).toHaveBeenCalled();
      });
    });
  });

  describe('IgniteProvider context', () => {
    const Wrapper = ({ children }: { children: any }) => (
      <IgniteProvider options={options}>{children}</IgniteProvider>
    );

    describe('login', () => {
      it('calls the login method on NativeAccountsSdk', async () => {
        const { getByTestId } = await renderAndFlush(
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

        expect(mockNativeAccountsSdk.login).toHaveBeenCalled();
      });

      describe('when login succeeds', () => {
        it('and skipUpdate is not passed - refreshes the state', async () => {
          const { getByTestId } = await renderAndFlush(
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

          mockNativeAccountsSdk.login.mockResolvedValue({
            accessToken: '123',
          });
          mockNativeAccountsSdk.isLoggedIn.mockResolvedValue(true);

          const loginButton = getByTestId('login-button');

          await act(async () => {
            loginButton.props.onPress();
          });

          expect(mockNativeAccountsSdk.login).toHaveBeenCalled();
          expect(mockNativeAccountsSdk.getMemberInfo).toHaveBeenCalled();
          expect(mockNativeAccountsSdk.isLoggedIn).toHaveBeenCalled();
        });

        it('and skipUpdate is false - refreshes the state', async () => {
          const { getByTestId } = await renderAndFlush(
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

          mockNativeAccountsSdk.login.mockResolvedValue({
            accessToken: '123',
          });
          mockNativeAccountsSdk.isLoggedIn.mockResolvedValue(true);

          const loginButton = getByTestId('login-button');

          await act(async () => {
            loginButton.props.onPress();
          });

          expect(mockNativeAccountsSdk.login).toHaveBeenCalled();
          expect(mockNativeAccountsSdk.getMemberInfo).toHaveBeenCalled();
          expect(mockNativeAccountsSdk.isLoggedIn).toHaveBeenCalled();
        });

        it('and skipUpdate is true - does not refresh the state', async () => {
          const { getByTestId } = await renderAndFlush(
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

          mockNativeAccountsSdk.login.mockResolvedValue({
            accessToken: '123',
          });
          mockNativeAccountsSdk.isLoggedIn.mockResolvedValue(true);

          const loginButton = getByTestId('login-button');

          await act(async () => {
            loginButton.props.onPress();
          });

          expect(mockNativeAccountsSdk.login).toHaveBeenCalled();
          expect(mockNativeAccountsSdk.getMemberInfo).not.toHaveBeenCalled();
          expect(mockNativeAccountsSdk.isLoggedIn).not.toHaveBeenCalled();
        });
      });

      it('when login fails, does not refresh the state', async () => {
        const { getByTestId } = await renderAndFlush(
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

        mockNativeAccountsSdk.login.mockResolvedValue({});
        mockNativeAccountsSdk.isLoggedIn.mockResolvedValue(true);

        const loginButton = getByTestId('login-button');

        await act(async () => {
          loginButton.props.onPress();
        });

        expect(mockNativeAccountsSdk.login).toHaveBeenCalled();
        await waitFor(() => {
          expect(mockNativeAccountsSdk.getMemberInfo).not.toHaveBeenCalled();
          expect(mockNativeAccountsSdk.isLoggedIn).not.toHaveBeenCalled();
        });
      });
    });

    describe('logout', () => {
      describe('when logout is triggered', () => {
        it('calls the logout method on NativeAccountsSdk', async () => {
          const { getByTestId } = await renderAndFlush(
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

          expect(mockNativeAccountsSdk.logout).toHaveBeenCalled();
        });

        it('when skipUpdate is not passed - refreshes the state', async () => {
          const { getByTestId } = await renderAndFlush(
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

          expect(mockNativeAccountsSdk.logout).toHaveBeenCalled();
          expect(mockNativeAccountsSdk.getMemberInfo).toHaveBeenCalled();
          expect(mockNativeAccountsSdk.isLoggedIn).toHaveBeenCalled();
        });

        it('when skipUpdate is false - refreshes the state', async () => {
          const { getByTestId } = await renderAndFlush(
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

          expect(mockNativeAccountsSdk.logout).toHaveBeenCalled();
          expect(mockNativeAccountsSdk.getMemberInfo).toHaveBeenCalled();
          expect(mockNativeAccountsSdk.isLoggedIn).toHaveBeenCalled();
        });

        it('when skipUpdate is true - does not refresh the state', async () => {
          const { getByTestId } = await renderAndFlush(
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

          expect(mockNativeAccountsSdk.logout).toHaveBeenCalled();
          expect(mockNativeAccountsSdk.getMemberInfo).not.toHaveBeenCalled();
          expect(mockNativeAccountsSdk.isLoggedIn).not.toHaveBeenCalled();
        });
      });
    });

    describe('getIsLoggedIn', () => {
      it('returns true when isLoggedIn returns true', async () => {
        let isLoggedInStatus: boolean | undefined;

        const { getByTestId } = await renderAndFlush(
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

        mockNativeAccountsSdk.isLoggedIn.mockResolvedValue(true);

        const isLoggedInButton = getByTestId('islogin-button');

        await act(async () => {
          isLoggedInButton.props.onPress();
        });

        expect(mockNativeAccountsSdk.isLoggedIn).toHaveBeenCalled();
        expect(isLoggedInStatus).toEqual(true);
      });

      it('returns false when isLoggedIn returns false', async () => {
        let isLoggedInStatus: boolean | undefined;

        const { getByTestId } = await renderAndFlush(
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

        mockNativeAccountsSdk.isLoggedIn.mockResolvedValue(false);

        const isLoggedInButton = getByTestId('islogin-button');

        await act(async () => {
          isLoggedInButton.props.onPress();
        });

        expect(mockNativeAccountsSdk.isLoggedIn).toHaveBeenCalled();
        expect(isLoggedInStatus).toEqual(false);
      });
    });

    describe('getToken', () => {
      it('returns the access token', async () => {
        const accessTokenData = {
          accessToken: '123',
          sportXRIdToken: '',
        };
        let accessToken: any;

        const { getByTestId } = await renderAndFlush(
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

        mockNativeAccountsSdk.getToken.mockResolvedValue(accessTokenData);

        const tokenButton = getByTestId('token-button');

        await act(async () => {
          tokenButton.props.onPress();
        });

        expect(mockNativeAccountsSdk.getToken).toHaveBeenCalled();
        expect(accessToken).toEqual(accessTokenData);
      });
    });

    describe('getMemberInfo', () => {
      it('returns member info', async () => {
        const memberInfoData = { name: 'Some Name' };
        let memberInfo: any;

        const { getByTestId } = await renderAndFlush(
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

        mockNativeAccountsSdk.getMemberInfo.mockResolvedValue(memberInfoData);

        const memberInfoButton = getByTestId('memberInfo-button');

        await act(async () => {
          memberInfoButton.props.onPress();
        });

        expect(mockNativeAccountsSdk.getMemberInfo).toHaveBeenCalled();
        expect(memberInfo).toEqual(memberInfoData);
      });
    });

    describe('refreshToken', () => {
      describe('ios', () => {
        it('returns a token', async () => {
          Platform.OS = 'ios';
          const iosAccessToken = {
            accessToken: '123',
            sportXRIdToken: '',
          };
          let token: any;

          const { getByTestId } = await renderAndFlush(
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

          mockNativeAccountsSdk.refreshToken.mockResolvedValue(iosAccessToken);

          const tokenButton = getByTestId('token-button');

          await act(async () => {
            tokenButton.props.onPress();
          });

          expect(mockNativeAccountsSdk.refreshToken).toHaveBeenCalled();
          expect(token).toEqual(iosAccessToken);
        });
      });

      describe('android', () => {
        it('returns a token', async () => {
          Platform.OS = 'android';
          const androidAccessToken = {
            accessToken: '123',
            sportXRIdToken: '',
          };
          let token: any;

          const { getByTestId } = await renderAndFlush(
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

          mockNativeAccountsSdk.refreshToken.mockResolvedValue(
            androidAccessToken
          );

          const tokenButton = getByTestId('token-button');

          await act(async () => {
            tokenButton.props.onPress();
          });

          expect(mockNativeAccountsSdk.refreshToken).toHaveBeenCalled();
          expect(token).toEqual(androidAccessToken);
        });
      });
    });
  });
});
