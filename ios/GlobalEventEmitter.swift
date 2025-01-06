@objc(GlobalEventEmitter)
class GlobalEventEmitter: RCTEventEmitter {

  public static var emitter: RCTEventEmitter!

  override init() {
    super.init()
    GlobalEventEmitter.emitter = self
  }

 override func supportedEvents() -> [String] {
    ["igniteAnalytics"]
  }
}
