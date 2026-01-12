import Foundation
import React

@objc(GlobalEventEmitter)
final class GlobalEventEmitter: RCTEventEmitter {

  private static var shared: GlobalEventEmitter?

  override init() {
    super.init()
    GlobalEventEmitter.shared = self
  }

  @objc
  static func sendEvent(name: String, body: [String: Any]) {
    shared?.sendEvent(withName: name, body: body)
  }

  override func supportedEvents() -> [String] {
    return ["igniteAnalytics"]
  }

  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
