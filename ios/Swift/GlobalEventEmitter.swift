import Foundation

/// Swift entry point for the analytics events sent to JavaScript.
///
/// Delivery goes through `TMIgniteEventHub`, which the React Native module `RCTGlobalEventEmitter`
/// (Objective-C++) registers itself with. Keeping React out of the Swift sources is what lets them
/// become a standalone Swift Package Manager target.
enum GlobalEventEmitter {

  static func sendEvent(name: String, body: [String: Any]) {
    TMIgniteEventHub.sink?.emitEvent(withName: name, body: body)
  }
}
