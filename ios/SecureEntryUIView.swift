class SecureEntryUIView: UIView {
    
  // Called when UI component is passed the "token" prop in RN code, "setToken:" is an auto generated selector created from RCT_EXPORT_VIEW_PROPERTY(token, NSString)
  @objc(setToken:)
  func setToken(_ token: String) {
    Config.shared.set(for: "secureEntryToken", value: token)
  }
}

