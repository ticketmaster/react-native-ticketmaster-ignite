import Foundation
import UIKit

/// Swift-side accessor for the shared configuration store (`TMIgniteConfigStore`), which the
/// `NativeConfig` TurboModule populates from JavaScript.
final class Config {

  static let shared = Config()

  private var store: TMIgniteConfigStore { TMIgniteConfigStore.shared }

  func get(for key: String) -> String {
    return store.getConfig(key) ?? ""
  }

  func set(for key: String, value: String) {
    store.setConfig(key, value: value)
  }

  // We want to return null to the SDK's Prebuilt Modules if no image overlay text is provided to enable the SDK's default text
  func optionalString(for key: String) -> String? {
    return store.getConfig(key)
  }

  func getImage(for key: String) -> UIImage? {
    return store.getImage(key)
  }
}
