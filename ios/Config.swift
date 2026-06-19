import Foundation

@objc
final class Config: NSObject {

  static let shared = Config()

  func get(for key: String) -> String {
    return RCTNativeConfig.sharedInstance()?.getConfig(key) ?? ""
  }

  func set(for key: String, value: String) {
    RCTNativeConfig.sharedInstance()?.setConfig(key, value: value)
  }

  // We want to return null to the SDK's Prebuilt Modules if no image overlay text is provided to enable the SDK's default text
  func optionalString(for key: String) -> String? {
    return RCTNativeConfig.sharedInstance()?.getConfig(key)
  }

  func getImage(for key: String) -> UIImage? {
    return RCTNativeConfig.sharedInstance()?.getImage(key)
  }
}
