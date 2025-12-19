import TicketmasterAuthentication
import React

@objcMembers public class NativeAccountsSdk: NSObject, TMAuthenticationDelegate {

//  @objc(configureAccountsSDKWithResolve:reject:)
  public func configureAccountsSDK(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {

    TMAuthentication.shared.delegate = self

    // build a combination of Settings and Branding
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

    print("Accounts SDK Configuring...")

    TMAuthentication.shared.configure(brandedServiceSettings: brandedServiceSettings) { backendsConfigured in
      print(" - Accounts SDK Configured: \(backendsConfigured.count)")
      resolve("Accounts SDK configuration successful")
    } failure: { error in
      print(" - Accounts SDK Configuration Error: \(error.localizedDescription)")
      reject("Accounts SDK Configuration Error", error.localizedDescription, error as NSError)
    }
  }

//  @objc(loginWithResolve:reject:)
  public func login(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {

    TMAuthentication.shared.login { authToken in
      print("Login Completed")
      print(" - AuthToken: \(authToken.accessToken.prefix(20))...")
      resolve(["accessToken": authToken.accessToken])
    } aborted: { _, _ in
      resolve(["accessToken": ""])
      print("Login Aborted by User")
    } failure: { _, error, _ in
      print("Login Error: \(error.localizedDescription)")
      reject("Accounts SDK Login Error", error.localizedDescription, error as NSError)
    }
  }

//  @objc(logoutWithResolve:reject:)
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

//  @objc(logoutAllWithResolve:reject:)
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
      if TMAuthentication.shared.hasToken() {
        resolve(true)
      } else {
        reject("Accounts SDK Is Logged In Error", error.localizedDescription, error as NSError)
      }
    }
  }

//  @objc(getMemberInfoWithResolve:reject:)
  public func getMemberInfo(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {

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

//  @objc(getTokenWithResolve:reject:)
  public func getToken(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {

    TMAuthentication.shared.validToken(showLoginIfNeeded: false) { authToken in
      resolve([
        "accessToken": authToken.accessToken,
        "sportXRIdToken": authToken.idToken ?? ""
      ])
    } aborted: { _, _ in
      resolve(["accessToken": ""])
    } failure: { _, error, _ in
      reject("Accounts SDK Token Retrieval Error", error.localizedDescription, error as NSError)
    }
  }

//  @objc(refreshTokenWithResolve:reject:)
  public func refreshToken(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {

    TMAuthentication.shared.validToken { authToken in
      resolve([
        "accessToken": authToken.accessToken,
        "sportXRIdToken": authToken.idToken ?? ""
      ])
    } aborted: { _, _ in
      resolve(["accessToken": ""])
    } failure: { _, error, _ in
      reject("Accounts SDK Refresh Token Error", error.localizedDescription, error as NSError)
    }
  }

//  @objc(getSportXRDataWithResolve:reject:)
  public func getSportXRData(
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {

    TMAuthentication.shared.apigeeConfig { config in
      resolve([
        "sportXRcookieName": config.sportXR?.cookieName ?? "",
        "sportXRTeamDomain": config.sportXR?.teamDomain ?? ""
      ])
    } failure: { error in
      reject("Accounts SDK SportXR Data Retrieval Error", error.localizedDescription, error as NSError)
    }
  }

  func convertToDictionary(_ value: Any) -> Any {
    let mirror = Mirror(reflecting: value)

    if mirror.displayStyle == .optional {
      if let child = mirror.children.first {
        return convertToDictionary(child.value)
      }
      return NSNull()
    }

    if value is String || value is Int || value is Bool || value is Double || value is Float {
      return value
    }

    if let array = value as? [Any] {
      return array.map { convertToDictionary($0) }
    }

    if mirror.displayStyle == .struct || mirror.displayStyle == .class {
      var dict: [String: Any] = [:]
      for child in mirror.children {
        guard let key = child.label else { continue }
        dict[key] = convertToDictionary(child.value)
      }
      return dict
    }

    return value
  }

  func sendEvent(_ name: String, body: [String: Any]) {
    GlobalEventEmitter.emitter.sendEvent(withName: name, body: body)
  }

  public func onStateChanged(
    backend: TMAuthentication.BackendService?,
    state: TMAuthentication.ServiceState,
    error: Error?
  ) {

    print("Backend TicketmasterAuthentication \(state.rawValue)")

    switch state {
    case .serviceConfigurationStarted:
      sendEvent("igniteAnalytics", body: ["accountsSdkServiceConfigurationStarted": "accountsSdkServiceConfigurationStarted"])
    case .serviceConfigured:
      sendEvent("igniteAnalytics", body: ["accountsSdkServiceConfigured": "accountsSdkServiceConfigured"])
    case .serviceConfigurationCompleted:
      sendEvent("igniteAnalytics", body: ["accountsSdkServiceConfigurationCompleted": "accountsSdkServiceConfigurationCompleted"])
    case .loginStarted:
      sendEvent("igniteAnalytics", body: ["accountsSdkLoginStarted": "accountsSdkLoginStarted"])
    case .loginPresented:
      sendEvent("igniteAnalytics", body: ["accountsSdkLoginPresented": "accountsSdkLoginPresented"])
    case .loggedIn:
      sendEvent("igniteAnalytics", body: ["accountsSdkLoggedIn": "accountsSdkLoggedIn"])
    case .loginAborted:
      sendEvent("igniteAnalytics", body: ["accountsSdkLoginAborted": "accountsSdkLoginAborted"])
    case .loginFailed:
      sendEvent("igniteAnalytics", body: ["accountsSdkLoginFailed": "accountsSdkLoginFailed"])
    case .loginLinkAccountPresented:
      sendEvent("igniteAnalytics", body: ["accountsSdkLoginAccountPresented": "accountsSdkLoginAccountPresented"])
    case .loginCompleted:
      sendEvent("igniteAnalytics", body: ["accountsSdkLoginAccountCompleted": "accountsSdkLoginAccountCompleted"])
    case .tokenRefreshed:
      sendEvent("igniteAnalytics", body: ["accountsSdkTokenRefreshed": "accountsSdkTokenRefreshed"])
    case .logoutStarted:
      sendEvent("igniteAnalytics", body: ["accountsSdkLogoutStarted": "accountsSdkLogoutStarted"])
    case .loggedOut:
      sendEvent("igniteAnalytics", body: ["accountsSdkLoggedOut": "accountsSdkLoggedOut"])
    case .logoutCompleted:
      sendEvent("igniteAnalytics", body: ["accountsSdkLogoutCompleted": "accountsSdkLogoutCompleted"])
    @unknown default:
      return
    }
  }
}
