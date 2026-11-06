import Foundation

/// Promise callback shapes matching React Native's `RCTPromiseResolveBlock` and
/// `RCTPromiseRejectBlock`, declared here so the Swift sources do not import React.
///
/// The Objective-C++ TurboModules pass their React Native promise blocks straight through; the
/// generated Swift header exposes these as the same Objective-C block types.
public typealias PromiseResolveBlock = (Any?) -> Void
public typealias PromiseRejectBlock = (String?, String?, Error?) -> Void
