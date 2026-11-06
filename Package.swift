// swift-tools-version: 5.9
//
// Swift Package Manager manifest for react-native-ticketmaster-ignite.
//
// Used by React Native's SwiftPM mode (React Native 0.88+, `npx react-native spm`). CocoaPods
// ignores this file and keeps using the podspec. React Native's autolinker symlinks this
// package into <app>/ios/build/generated/autolinking/libs/RNTicketmasterIgnite, which is where
// the relative `path:` dependencies below are resolved from.
//
// Targets (see CONTRIBUTING.md, "iOS source layout"):
//   RNTicketmasterIgniteInterface  ios/Interface  Objective-C protocols, config store and event hub
//   RNTicketmasterIgniteSwift      ios/Swift      Swift wrappers around the Ticketmaster Ignite SDK
//   RNTicketmasterIgnite           ios/           Objective-C++ TurboModules and Fabric views (the product)

import PackageDescription

// Must match `tmIgniteVersion` in package.json, which the podspec reads. `yarn lint:tm-sdk` checks this.
let ticketmasterSDKVersion = "1.22.1"

// The Ignite SDK ships eight dynamic xcframeworks with no dependencies declared between them,
// so link all of them.
let ticketmasterSDK: [Target.Dependency] = [
  "TicketmasterFoundation",
  "TicketmasterAuthentication",
  "TicketmasterDiscoveryAPI",
  "TicketmasterPrePurchase",
  "TicketmasterPurchase",
  "TicketmasterSwiftProtobuf",
  "TicketmasterSecureEntry",
  "TicketmasterTickets",
].map { .product(name: $0, package: "iOS-TicketmasterSDK") }

let reactNative: [Target.Dependency] = [
  // <React/...> headers and the `React` module.
  .product(name: "ReactHeaders", package: "ReactNative"),
  // <ReactCommon/...>, <react/renderer/...>, <jsi/...>.
  .product(name: "ReactNativeHeaders", package: "ReactNative"),
  // folly / glog / boost headers pulled in by the above.
  .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"),
  // The app's codegen output for this library: <TicketmasterIgniteSpecs/...> and
  // <react/renderer/components/TicketmasterIgniteSpecs/...>.
  .product(name: "ReactAppHeaders", package: "React-GeneratedCode"),
]

let package = Package(
  name: "RNTicketmasterIgnite",
  // The Ticketmaster Ignite SDK requires iOS 17.
  platforms: [.iOS(.v17)],
  products: [
    .library(name: "RNTicketmasterIgnite", targets: ["RNTicketmasterIgnite"]),
  ],
  dependencies: [
    .package(name: "ReactNative", path: "../../../../xcframeworks"),
    .package(name: "React-GeneratedCode", path: "../../../ios"),
    .package(
      url: "https://github.com/ticketmaster/iOS-TicketmasterSDK",
      exact: Version(stringLiteral: ticketmasterSDKVersion)
    ),
  ],
  targets: [
    .target(
      name: "RNTicketmasterIgniteInterface",
      path: "ios/Interface",
      publicHeadersPath: "include"
    ),
    .target(
      name: "RNTicketmasterIgniteSwift",
      dependencies: ["RNTicketmasterIgniteInterface"] + ticketmasterSDK,
      path: "ios/Swift"
    ),
    .target(
      name: "RNTicketmasterIgnite",
      dependencies: ["RNTicketmasterIgniteInterface", "RNTicketmasterIgniteSwift"] + reactNative,
      path: "ios",
      exclude: ["Interface", "Swift"],
      publicHeadersPath: "include",
      cSettings: [
        // Lets the sources find their own headers (`#import "RCTNativeConfig.h"`).
        .headerSearchPath("."),
        // CocoaPods compiles the pod with this (install_modules_dependencies); keep SwiftPM identical.
        .define("RCT_NEW_ARCH_ENABLED", to: "1"),
        // Selects `@import RNTicketmasterIgniteSwift` in TMIgniteSwiftFactory.m.
        .define("RN_TICKETMASTER_IGNITE_SWIFTPM", to: "1"),
      ],
      cxxSettings: [
        // Required by React Native: Fabric C++ must be compiled with the same NDEBUG state as the
        // prebuilt React.framework or the ShadowNode ABI diverges and the link fails.
        .define("DEBUG", .when(configuration: .debug)),
        .define("NDEBUG", .when(configuration: .release)),
      ],
      linkerSettings: [
        .linkedFramework("Foundation"),
        .linkedFramework("UIKit"),
      ]
    ),
  ],
  cxxLanguageStandard: .cxx20
)
