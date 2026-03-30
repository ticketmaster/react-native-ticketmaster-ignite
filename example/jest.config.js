/**
 * Jest cannot directly test files from shared/ due to RN native module bridging issues.
 * Shared components must be mocked in __mocks__/@shared/components/.
 *
 * If tests fail with "__fbBatchedBridgeConfig is not set" after adding a new shared component:
 * 1. Create a mock in __mocks__/@shared/components/YourComponent.tsx
 * 2. Add the mapping below: '^@shared/components/YourComponent$': '<rootDir>/__mocks__/@shared/components/YourComponent'
 */
module.exports = {
  preset: 'react-native',
  moduleNameMapper: {
    // Mocked shared components (add new ones here when needed)
    '^@shared/components/AccountsSdkOptions$':
      '<rootDir>/__mocks__/@shared/components/AccountsSdkOptions',
    '^@shared/components/RetailSdkOptions$':
      '<rootDir>/__mocks__/@shared/components/RetailSdkOptions',
    '^@shared/components/TicketsSdkOptions$':
      '<rootDir>/__mocks__/@shared/components/TicketsSdkOptions',
    '^@shared/components/SectionHeader$':
      '<rootDir>/__mocks__/@shared/components/SectionHeader',
    '^@shared/components/SdkButton$':
      '<rootDir>/__mocks__/@shared/components/SdkButton',
    // Other shared paths (types, etc.) resolve to actual files
    '^@shared/(.*)$': '<rootDir>/../shared/$1',
    '^react-native-ticketmaster-ignite$': '<rootDir>/../src/index',
    '^react-native-svg$': '<rootDir>/__mocks__/react-native-svg.tsx',
  },
  modulePathIgnorePatterns: ['<rootDir>/lib/'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?react-native|@react-native|@react-navigation)',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};
