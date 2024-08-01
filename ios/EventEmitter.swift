@objc(EventEmitter)
class EventEmitter: RCTEventEmitter {

  public static var emitter: RCTEventEmitter!

  override init() {
    super.init()
      EventEmitter.emitter = self
  }

 override func supportedEvents() -> [String] {
    ["igniteAnalytics"]
  }
}
