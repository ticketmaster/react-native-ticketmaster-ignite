import TicketmasterAuthentication
import React

@objcMembers public class AccountsSdk: NSObject, TMAuthenticationDelegate {
  
  public func configureAccountsSDK(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    
    TMAuthentication.shared.delegate = self
    
    let apiKey = Config.shared.get(for: "apiKey")
    let region = Config.shared.get(for: "region")
    let environment = Config.shared.get(for: "environment")
    let tmxServiceSettings = TMAuthentication.TMXSettings(
      apiKey: apiKey,
      region: TMAuthentication.TMXDeploymentRegion(rawValue: region) ?? .US,
      environment: TMAuthentication.TMXDeploymentEnvironment(rawValue: environment) ?? .Production
    )
    
    let primaryColor = Config.shared.get(for: "primaryColor")
    let backgroundColor = UIColor(hexString: primaryColor) ?? AppConstants.defaultBrandColor
    let branding = TMAuthentication.Branding(
      displayName: Config.shared.get(for: "clientName"),
      backgroundColor: backgroundColor,
      theme: .light
    )
    
    let brandedServiceSettings = TMAuthentication.BrandedServiceSettings(
      tmxSettings: tmxServiceSettings,
      branding: branding
    )
    
    // configure TMAuthentication with Settings and Branding
    print("Accounts SDK Configuring...")
    
    TMAuthentication.shared.configure(brandedServiceSettings: brandedServiceSettings) { backendsConfigured in
      // your API key may contain configurations for multiple backend services
      // the details are not needed for most common use-cases
      print(" - Accounts SDK Configured: \(backendsConfigured.count)")
      resolve("Accounts SDK configuration successful")
    } failure: { error in
      // something went wrong, probably the wrong apiKey+region combination
      print(" - Accounts SDK Configuration Error: \(error.localizedDescription)")
      reject("Accounts SDK Configuration Error", error.localizedDescription, error as NSError)
    }
  }
  
  public func login(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    
    TMAuthentication.shared.login { authToken in
      print("Login Completed")
      print(" - AuthToken: \(authToken.accessToken.prefix(20))...")
      resolve(["accessToken": authToken.accessToken])
    } aborted: { _, _ in
      // Login was explicitly aborted by the user
      resolve(["accessToken": ""])
      print("Login Aborted by User")
    } failure: { _, error, _ in
      print("Login Error: \(error.localizedDescription)")
      reject("Accounts SDK Login Error", error.localizedDescription, error as NSError)
    }
  }
  
  public func logout(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    
    TMAuthentication.shared.logout { backends in
      resolve("Logout Successful")
      print("Logout Completed")
      print(" - Backends Count: \(backends?.count ?? 0)")
    }
  }
  
  public func logoutAll(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    
    TMAuthentication.shared.logoutAll { backends in
      resolve("LogoutAll Successful")
      print("LogoutAll Completed")
      print(" - Backends Count: \(backends?.count ?? 0)")
    }
  }
  
  // This selector is needed as Swift’s Objective-C selector inference drops the "is" in variable names sent to Objective-C.
  // React side expects a method that exactly matches "isLoggedIn", so this selector is used to tell Objective-C the "isLoggedIn" method is this method below.
  @objc(isLoggedInWithResolve:reject:)
  public func isLoggedIn(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    
    TMAuthentication.shared.validToken(showLoginIfNeeded: false) { _ in
      let hasToken = TMAuthentication.shared.hasToken()
      resolve(hasToken)
    } aborted: { _, _ in
      resolve(false)
    } failure: { _, error, _ in
      // If a token already exists, treat user as logged in
      if TMAuthentication.shared.hasToken() {
        resolve(true)
      } else {
        reject("Accounts SDK Is Logged In Error", error.localizedDescription, error as NSError)
      }
    }
  }
  
  public func getMemberInfo(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    
    // Map of iOS (key) to Android (value) memberInfo key name equivalents.
    // iOS getMemberInfo() will use the Android names as the key for the object
    // returned to JS as camelCase is preferred.
    let keyMap: [String: String] = [
      "localID": "memberId",
      "globalID": "globalUserId",
      "hmacID": "hmacId",
      "language": "preferredLang"
    ]
    
    TMAuthentication.shared.memberInfo { memberInfo in
      print("MemberInfo Completed")
      print(" - UserID: \(memberInfo.localID ?? "<nil>")")
      print(" - Email: \(memberInfo.email ?? "<nil>")")
      
      let mirror = Mirror(reflecting: memberInfo)
      var data: [String: Any] = [:]
      
      for child in mirror.children {
        guard let originalKey = child.label else { continue }
        let finalKey = keyMap[originalKey] ?? originalKey
        data[finalKey] = self.convertToDictionary(child.value)
      }
      
      resolve(data)
    } failure: { _, error, _ in
      print("MemberInfo Error: \(error.localizedDescription)")
      reject("Accounts SDK Member Info Error", error.localizedDescription, error as NSError)
    }
  }
  
  public func getToken(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    
    TMAuthentication.shared.validToken(showLoginIfNeeded: false) { authToken in
      print("Token Retrieved")
      resolve([
        "accessToken": authToken.accessToken,
        "sportXRIdToken": authToken.idToken ?? ""
      ])
    } aborted: { _, _ in
      print("Token Retrieval Aborted")
      resolve(["accessToken": ""])
    } failure: { _, error, _ in
      print("Token Retrieval Error: \(error.localizedDescription)")
      reject("Accounts SDK Token Retrieval Error", error.localizedDescription, error as NSError)
    }
  }
  
  public func refreshToken(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    
    TMAuthentication.shared.validToken { authToken in
      print("Token Refreshed (if needed)")
      print(" - AuthToken: \(authToken.accessToken.prefix(20))...")
      resolve([
        "accessToken": authToken.accessToken,
        "sportXRIdToken": authToken.idToken ?? ""
      ])
    } aborted: { _, _ in
      print("Refresh Login Aborted by User")
      resolve(["accessToken": ""])
    } failure: { _, error, _ in
      print("Refresh Error: \(error.localizedDescription)")
      reject("Accounts SDK Refresh Token Error", error.localizedDescription, error as NSError)
    }
  }
  
  public func getSportXRData(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    
    TMAuthentication.shared.apigeeConfig { config in
      print("SportXR Data Retrieved")
      resolve([
        "sportXRcookieName": config.sportXR?.cookieName ?? "",
        "sportXRTeamDomain": config.sportXR?.teamDomain ?? ""
      ])
    } failure: { error in
      print("SportXR Data Retrieval Error: \(error.localizedDescription)")
      reject("Accounts SDK SportXR Data Retrieval Error", error.localizedDescription, error as NSError)
    }
  }
  
  func convertToDictionary(_ value: Any) -> Any {
    let mirror = Mirror(reflecting: value)
    
    // Convert Swift Optionals to correct bridging value for JavaScript
    if mirror.displayStyle == .optional {
      if let child = mirror.children.first {
        return convertToDictionary(child.value)
      }
      return NSNull()
    }
    
    // return primitive types as is
    if value is String || value is Int || value is Bool || value is Double || value is Float {
      return value
    }
    
    // Convert values in an Array to correct bridging value for JavaScript
    if let array = value as? [Any] {
      return array.map { convertToDictionary($0) }
    }
    
    // Convert Struct/Class to correct bridging value for JavaScript (i.e. an object)
    if mirror.displayStyle == .struct || mirror.displayStyle == .class {
      var dict: [String: Any] = [:]
      for child in mirror.children {
        guard let key = child.label else { continue }
        dict[key] = convertToDictionary(child.value)
      }
      return dict
    }
    
    // Default fallback
    return value
  }
  
  public func onStateChanged(
    backend: TMAuthentication.BackendService?,
    state: TMAuthentication.ServiceState,
    error: Error?
  ) {
    
    print("Backend TicketmasterAuthentication \(state.rawValue)")
    
    let eventName = "igniteAnalytics"
    
    switch state {
    case .serviceConfigurationStarted:
      GlobalEventEmitter.sendEvent(
        name: eventName,
        body: ["accountsSdkServiceConfigurationStarted": "accountsSdkServiceConfigurationStarted"]
      )
    case .serviceConfigured:
      GlobalEventEmitter.sendEvent(
        name: eventName,
        body: ["accountsSdkServiceConfigured": "accountsSdkServiceConfigured"]
      )
    case .serviceConfigurationCompleted:
      GlobalEventEmitter.sendEvent(
        name: eventName,
        body: ["accountsSdkServiceConfigurationCompleted": "accountsSdkServiceConfigurationCompleted"]
      )
    case .loginStarted:
      GlobalEventEmitter.sendEvent(
        name: eventName,
        body: ["accountsSdkLoginStarted": "accountsSdkLoginStarted"]
      )
    case .loginPresented:
      GlobalEventEmitter.sendEvent(
        name: eventName,
        body: ["accountsSdkLoginPresented": "accountsSdkLoginPresented"]
      )
    case .loggedIn:
      GlobalEventEmitter.sendEvent(
        name: eventName,
        body: ["accountsSdkLoggedIn": "accountsSdkLoggedIn"]
      )
    case .loginAborted:
      GlobalEventEmitter.sendEvent(
        name: eventName,
        body: ["accountsSdkLoginAborted": "accountsSdkLoginAborted"]
      )
    case .loginFailed:
      GlobalEventEmitter.sendEvent(
        name: eventName,
        body: ["accountsSdkLoginFailed": "accountsSdkLoginFailed"]
      )
    case .loginLinkAccountPresented:
      GlobalEventEmitter.sendEvent(
        name: eventName,
        body: ["accountsSdkLoginAccountPresented": "accountsSdkLoginAccountPresented"]
      )
    case .loginCompleted:
      GlobalEventEmitter.sendEvent(
        name: eventName,
        body: ["accountsSdkLoginAccountCompleted": "accountsSdkLoginAccountCompleted"]
      )
    case .tokenRefreshed:
      GlobalEventEmitter.sendEvent(
        name: eventName,
        body: ["accountsSdkTokenRefreshed": "accountsSdkTokenRefreshed"]
      )
    case .logoutStarted:
      GlobalEventEmitter.sendEvent(
        name: eventName,
        body: ["accountsSdkLogoutStarted": "accountsSdkLogoutStarted"]
      )
    case .loggedOut:
      GlobalEventEmitter.sendEvent(
        name: eventName,
        body: ["accountsSdkLoggedOut": "accountsSdkLoggedOut"]
      )
    case .logoutCompleted:
      GlobalEventEmitter.sendEvent(
        name: eventName,
        body: ["accountsSdkLogoutCompleted": "accountsSdkLogoutCompleted"]
      )
    @unknown default:
      return
    }
  }
}
