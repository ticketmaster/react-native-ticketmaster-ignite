# Test Issues - React Native 0.81.5

Known test issues that will be resolved by upgrading to the latest React Native version.

## 1. Skipped `setImage` tests in `IgniteProvider.test.tsx`

**Location:** `__tests__/IgniteProvider.test.tsx` - lines 505 and 829

**What's skipped:** Two `describe.skip('calls setImage', ...)` blocks:
- `seatUpgradesModule` → `calls setImage` → `when image provided`
- `venueConcessionsModule` → `calls setImage` → `when image provided`

**Root cause:** React Native 0.81's Jest mock for `Image` is broken. The built-in mock at `node_modules/react-native/jest/mocks/Image.js` calls `mockComponent('../Libraries/Image/Image', null, true)`. The `mockComponent` function (`node_modules/react-native/jest/mockComponent.js:42`) checks `RealComponent.prototype.constructor instanceof React.Component`, but `Image` in RN 0.81 is a `forwardRef`/function component with no `prototype.constructor`, causing a `TypeError: Cannot read properties of undefined (reading 'constructor')`.

This means `Image.resolveAssetSource()` is unavailable in the Jest environment, so any test that triggers the code path in `src/IgniteProvider.tsx:297-310` (which calls `Image.resolveAssetSource(optionValue)`) will crash.

**Fix after RN upgrade:** Remove the `.skip` from both `describe.skip('calls setImage', ...)` blocks. The upgraded RN version should have a fixed `mockComponent` that handles non-class components. Verify `Image.resolveAssetSource` works in tests without any manual mocking.

**Files to update:**
- `__tests__/IgniteProvider.test.tsx` - change `describe.skip` to `describe` at both `calls setImage` blocks

---

## 2. Example app tests failing - `react-native-svg` / `__fbBatchedBridgeConfig`

**Location:** All 4 test files in `example/__tests__/`:
- `example/__tests__/components/RetailSDKOptions.test.tsx`
- `example/__tests__/components/TicketsSDKOptions.test.tsx`
- `example/__tests__/components/AccountsSDKOptions.test.tsx`
- `example/__tests__/screens/Home.test.tsx`

**Error:** `Invariant Violation: __fbBatchedBridgeConfig is not set, cannot invoke native modules`

**Root cause:** The `react-native-svg` package (v15.14.0) transitively imports native modules during its initialisation via `SvgTouchableMixin.js` → `Touchable` → `View` → `ReactNativeFeatureFlags` → `TurboModuleRegistry` → `NativeModules`. Since `__fbBatchedBridgeConfig` isn't configured in the Jest environment, this crashes before any test code runs.

The import chain is: test file → component → `SDKButton.tsx` → `ChevronRight.tsx` → `react-native-svg` → crash.

**Fix after RN upgrade:** The latest RN version may resolve the `__fbBatchedBridgeConfig` issue. If not, a `jest.mock('react-native-svg', ...)` in the example app's Jest setup would be the appropriate fix. For example, in `example/jest-setup.ts`:

```typescript
jest.mock('react-native-svg', () => {
  const React = require('react');
  const mockComponent = (name: string) =>
    React.forwardRef((props: any, ref: any) =>
      React.createElement(name, { ...props, ref })
    );
  return {
    __esModule: true,
    default: mockComponent('Svg'),
    Svg: mockComponent('Svg'),
    Path: mockComponent('Path'),
    SvgProps: {},
  };
});
```

**Files to update:**
- Potentially add a `react-native-svg` mock to the example app's Jest setup
- Or verify the issue is resolved after the RN upgrade
