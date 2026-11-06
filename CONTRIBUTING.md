# Contributing

Contributions are always welcome, no matter how large or small!

We want this community to be friendly and respectful to each other. Please follow it in all your interactions with the project. Before contributing, please read the [code of conduct](./CODE_OF_CONDUCT.md).

## Development workflow

This project is a monorepo managed using [Yarn workspaces](https://yarnpkg.com/features/workspaces). It contains the following packages:

- The library package in the root directory.
- An example app in the `example/` directory.

To get started with the project, run `yarn` in the root directory to install the required dependencies for each package:

```sh
yarn
```

> Since the project relies on Yarn workspaces, you cannot use [`npm`](https://github.com/npm/cli) for development.

The [example app](/example/) demonstrates usage of the library. You need to run it to test any changes you make.

It is configured to use the local version of the library, so any changes you make to the library's source code will be reflected in the example app. Changes to the library's JavaScript code will be reflected in the example app without a rebuild, but native code changes will require a rebuild of the example app.

If you want to use Android Studio or XCode to edit the native code, you can open the `example/android` or `example/ios` directories respectively in those editors. To edit the Objective-C or Swift files, open `example/ios/TicketmasterIgniteExample.xcworkspace` in XCode and find the source files at `Pods > Development Pods > react-native-ticketmaster-ignite`.

To edit the Java or Kotlin files, open `example/android` in Android studio and find the source files at `react-native-ticketmaster-ignite` under `Android`.

#### iOS source layout

The native iOS sources in `ios/` are split by language so that Swift and Objective-C++ can later be built as separate Swift Package Manager targets (SwiftPM cannot mix the two in one target). CocoaPods still compiles everything into one module through the podspec's `ios/**` glob.

- `ios/Swift/` — Swift code wrapping the Ticketmaster SDK. It must not import `React`; it reaches the React layer only through the Objective-C types in `ios/Interface/`, and each class the React layer needs adopts one of the `TMIgnite*` protocols from there.
- `ios/Interface/` — small Objective-C types shared by both sides: the configuration store, the analytics event sink, and the `TMIgnite*` protocols (`TMIgniteAccountsSDK`, `TMIgniteRetailSDK`, `TMIgniteTicketsSDKModal`, `TMIgniteTicketsEmbeddedView`, `TMIgniteSecureEntryView`) that describe what Swift provides. Public headers live in `ios/Interface/include/`. Nothing here may depend on React or the Ticketmaster SDK.
- `ios/` (root) — Objective-C++ TurboModules and Fabric views that React Native instantiates. These may import React and the codegen headers, but **not** the generated Swift header: Objective-C++ cannot import a Swift package target. They obtain Swift objects, typed by the Interface protocols, from `TMIgniteSwiftFactory`.
- `ios/TMIgniteSwiftFactory.m` — the one plain Objective-C file allowed to import the Swift layer (`@import RNTicketmasterIgniteSwift` under SwiftPM, the generated `-Swift.h` under CocoaPods).

Put new files in the directory matching their language and role. To expose a new Swift capability to React: add a method to the matching `TMIgnite*` protocol, implement it in Swift, and call it through the protocol from the `.mm` file — never import the Swift header from a `.mm`.

#### Validating Swift Package Manager mode

The root `Package.swift` is what React Native's SwiftPM mode (0.88+) consumes; CocoaPods ignores it. `yarn lint:tm-sdk` checks that its Ticketmaster SDK pin matches `tmIgniteVersion` in package.json. To build the example app in SwiftPM mode:

```sh
yarn example spm:prepare     # cleans stale codegen, scaffolds manifests for deps that ship none, runs `spm add --deintegrate`
yarn example build:ios:spm
cd example/ios && npx react-native spm deinit && git checkout -- . && pod install   # back to CocoaPods
```

Because the example resolves the library through the workspace symlink, React Native's header merge walks this whole repository and treats any other codegen output it finds (for example `expo/ios/Pods` or an old `example/ios/build/generated`) as part of the library. Delete those first if you see "non-identical collision" warnings. Do not commit the converted Xcode project; the example stays on CocoaPods.

You can use various commands from the root directory to work with the project.

To start the packager:

```sh
yarn example start
```

To run the example app on Android:

```sh
yarn example android
```

To run the example app on iOS:

```sh
yarn example ios
```

Make sure your code passes TypeScript and ESLint. Run the following to verify:

```sh
yarn typecheck
yarn lint
```

To fix formatting errors, run the following:

```sh
yarn lint --fix
```

Remember to add tests for your change if possible. Run the unit tests by:

```sh
yarn test
```

### Commit message convention

We follow the [conventional commits specification](https://www.conventionalcommits.org/en) for our commit messages:

- `fix`: bug fixes, e.g. fix crash due to deprecated method.
- `feat`: new features, e.g. add new method to the module.
- `refactor`: code refactor, e.g. migrate from class components to hooks.
- `docs`: changes into documentation, e.g. add usage example for the module..
- `test`: adding or updating tests, e.g. add integration tests using detox.
- `chore`: tooling changes, e.g. change CI config.

Our pre-commit hooks verify that your commit message matches this format when committing.

### Linting and tests

[ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [TypeScript](https://www.typescriptlang.org/)

We use [TypeScript](https://www.typescriptlang.org/) for type checking, [ESLint](https://eslint.org/) with [Prettier](https://prettier.io/) for linting and formatting the code, and [Jest](https://jestjs.io/) for testing.

Our pre-commit hooks verify that the linter and tests pass when committing.

### Publishing to npm

We use [release-it](https://github.com/release-it/release-it) to make it easier to publish new versions. It handles common tasks like bumping version based on semver, creating tags and releases etc.

To publish new versions, run the following:

```sh
yarn release
```

### Scripts

The `package.json` file contains various scripts for common tasks:

- `yarn`: setup project by installing dependencies.
- `yarn typecheck`: type-check files with TypeScript.
- `yarn lint`: lint files with ESLint.
- `yarn test`: run unit tests with Jest.
- `yarn example start`: start the Metro server for the example app.
- `yarn example android`: run the example app on Android.
- `yarn example ios`: run the example app on iOS.

### Sending a pull request

> **Working on your first pull request?** You can learn how from this _free_ series: [How to Contribute to an Open Source Project on GitHub](https://app.egghead.io/playlists/how-to-contribute-to-an-open-source-project-on-github).

When you're sending a pull request:

- Prefer small pull requests focused on one change.
- Verify that linters and tests are passing.
- Review the documentation to make sure it looks good.
- Follow the pull request template when opening a pull request.
- For pull requests that change the API or implementation, discuss with maintainers first by opening an issue.
