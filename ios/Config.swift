import Foundation
import React

@objc
final class Config: NSObject {
  
  static let shared = Config()
  
  private var nativeConfig: RCTNativeConfig? {
    RCTBridge.current()?.module(forName: "NativeConfig") as? RCTNativeConfig
  }
  
  func get(for key: String) -> String {
    print("Swift get key=\(key) value=\(nativeConfig?.getConfig(key) ?? "")")
    return nativeConfig?.getConfig(key) ?? ""
  }
  
  func set(for key: String, value: String) {
    print("Swift set key=\(key) value=\(value)")
    nativeConfig?.setConfig(key, value: value)
  }
  
  func optionalString(for key: String) -> String? {
    let value = nativeConfig?.getConfig(key)
    return value == nil ? nil : value
  }
  
  func getImage(for key: String) -> UIImage? {
    return nativeConfig?.getImage(key)
  }
}
