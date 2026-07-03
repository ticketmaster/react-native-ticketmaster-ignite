jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('./src/specs/NativeAccountsSdk', () => ({
  __esModule: true,
  default: {
    notifyConfigurationRefreshed: jest.fn(),
  },
}));
