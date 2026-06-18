import Foundation
import React

@objc
final class Config: NSObject {
  
  static let shared = Config()
  
  func get(for key: String) -> String {
    return RCTNativeConfig.getForKey(key) ?? ""
  }

  func set(for key: String, value: String) {
    RCTNativeConfig.setConfig(value, forKey: key)
  }

  func optionalString(for key: String) -> String? {
    return RCTNativeConfig.getForKey(key)
  }

  func getImage(for key: String) -> UIImage? {
    return RCTNativeConfig.getImageForKey(key)
  }
}
