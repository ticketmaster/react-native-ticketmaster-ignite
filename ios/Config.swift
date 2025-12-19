import Foundation
import React

@objc
final class Config: NSObject {

  static let shared = Config()

  private let nativeConfig: RCTNativeConfig

  private override init() {
    self.nativeConfig = RCTNativeConfig()
    super.init()
  }

  func get(for key: String) -> String {
      return nativeConfig.getConfig(key) ?? ""
  }

  func set(for key: String, value: String) {
    nativeConfig.setConfig(key, value: value)
  }

  func optionalString(for key: String) -> String? {
      let value = nativeConfig.getConfig(key)
      return value == nil ? nil : value
  }

  func getImage(for key: String) -> UIImage? {
      return nativeConfig.getImage(key)
  }
}
