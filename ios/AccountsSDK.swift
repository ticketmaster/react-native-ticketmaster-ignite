import TicketmasterAuthentication

@objc(AccountsSDK)
class AccountsSDK: NSObject, TMAuthenticationDelegate  {
  
  @objc public func configureAccountsSDK(_ resolve: @escaping (String) -> Void, reject: @escaping (_ code: String, _ message: String, _ error: NSError) -> Void) {
    
    TMAuthentication.shared.delegate = self
    
    // build a combination of Settings and Branding
    let apiKey = Config.shared.get(for: "apiKey")
    let region = Config.shared.get(for: "region")
    let environment = Config.shared.get(for: "environment")
    let tmxServiceSettings = TMAuthentication.TMXSettings(apiKey: apiKey,
                                                          region: TMAuthentication.TMXDeploymentRegion(rawValue: region) ?? .US, environment: TMAuthentication.TMXDeploymentEnvironment(rawValue: environment) ?? .Production )
    
    let primaryColor = Config.shared.get(for: "primaryColor")
    let backgroundColor = UIColor(hexString: primaryColor) ?? AppConstants.defaultBrandColor
    let branding = TMAuthentication.Branding(displayName: Config.shared.get(for: "clientName"), backgroundColor: backgroundColor, theme: .light)
    
    let brandedServiceSettings = TMAuthentication.BrandedServiceSettings(tmxSettings: tmxServiceSettings,
                                                                         branding: branding)
    
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
      reject( "Accounts SDK Configuration Error:", error.localizedDescription, error as NSError)
    }
  }
  
  
  @objc public func login(_ resolve: @escaping ([String: Any]) -> Void, reject: @escaping (_ code: String, _ message: String, _ error: NSError) -> Void) {
    
    TMAuthentication.shared.login { authToken in
      print("Login Completed")
      print(" - AuthToken: \(authToken.accessToken.prefix(20))...")
      let data = ["accessToken": authToken.accessToken]
      resolve(data)
    } aborted: { oldAuthToken, backend in
      let data = ["accessToken": ""]
      resolve(data)
      print("Login Aborted by User")
    } failure: { oldAuthToken, error, backend in
      print("Login Error: \(error.localizedDescription)")
      reject( "Accounts SDK Login Error", error.localizedDescription, error as NSError)
    }
  }
  
  
  @objc public func logout(_ resolve: @escaping (String) -> Void, reject: @escaping (_ code: String, _ message: String, _ error: NSError) -> Void) {
    TMAuthentication.shared.logout {backends in
      resolve("Logout Successful")
      print("Logout Completed")
      print(" - Backends Count: \(backends?.count ?? 0)")
    }
  }
  
  @objc public func logoutAll(_ resolve: @escaping (String) -> Void, reject: @escaping (_ code: String, _ message: String, _ error: NSError) -> Void) {
    TMAuthentication.shared.logoutAll {backends in
      resolve("LogoutAll Successful")
      print("LogoutAll Completed")
      print(" - Backends Count: \(backends?.count ?? 0)")
    }
  }
  
  @objc public func isLoggedIn(_ resolve: @escaping ([String: Bool]) -> Void, reject: @escaping (_ code: String, _ message: String, _ error: NSError) -> Void) {
    TMAuthentication.shared.validToken(showLoginIfNeeded: false) { authToken in
      let hasToken = TMAuthentication.shared.hasToken()
      resolve(["result": hasToken])
    } aborted: { oldAuthToken, backend in
      resolve(["result": false])
    } failure: { oldAuthToken, error, backend in
      if(TMAuthentication.shared.hasToken()){
        let hasToken = TMAuthentication.shared.hasToken()
        resolve(["result": hasToken])
      } else {
        reject("Accounts SDK Is Logged In Error", error.localizedDescription, error as NSError)
      }
    }
  }
  
  @objc public func getMemberInfo(_ resolve: @escaping ([String: Any]) -> Void, reject: @escaping (_ code: String, _ message: String, _ error: NSError) -> Void) {
    
    // Map of iOS (key) to Android (value) memberInfo key name equivalents, iOS getMemberInfo() will use the android names as the key for the object returned to JS as camel case is preferred
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
      print(memberInfo)
      let mirror = Mirror(reflecting: memberInfo)
          var data: [String: Any] = [:]

          for child in mirror.children {
              guard let originalKey = child.label else { continue }

              let finalKey = keyMap[originalKey] ?? originalKey
            data[finalKey] = self.convertToDictionary(child.value)
          }
      resolve(data)
    } failure: { oldMemberInfo, error, backend in
      print("MemberInfo Error: \(error.localizedDescription)")
      reject( "Accounts SDK Member Info Error", error.localizedDescription, error as NSError)
    }
  }
  
  @objc public func getToken(_ resolve: @escaping ([String: Any]) -> Void, reject: @escaping (_ code: String, _ message: String, _ error: NSError) -> Void) {
    TMAuthentication.shared.validToken(showLoginIfNeeded: false) { authToken in
      print("Token Retrieved")
      let data = ["accessToken": authToken.accessToken, "sportXRIdToken": authToken.idToken ?? ""]
      resolve(data)
    } aborted: { oldAuthToken, backend in
      print("Token Retrieval Aborted")
      let data = ["accessToken": ""]
      resolve(data)
    } failure: { oldAuthToken, error, backend in
      print("Token Retrieval Error: \(error.localizedDescription)")
      reject( "Accounts SDK Token Retrieval Error", error.localizedDescription, error as NSError)
    }
  }
  
  @objc public func refreshToken(_ resolve: @escaping ([String: Any]) -> Void, reject: @escaping (_ code: String, _ message: String, _ error: NSError) -> Void) {
    
    TMAuthentication.shared.validToken { authToken in
      print("Token Refreshed (if needed)")
      print(" - AuthToken: \(authToken.accessToken.prefix(20))...")
      let data = ["accessToken": authToken.accessToken, "sportXRIdToken": authToken.idToken ?? ""]
      resolve(data)
    } aborted: { oldAuthToken, backend in
      print("Refresh Login Aborted by User")
      let data = ["accessToken": ""]
      resolve(data)
    } failure: { oldAuthToken, error, backend in
      print("Refresh Error: \(error.localizedDescription)")
      reject( "Accounts SDK Refresh Token Error", error.localizedDescription, error as NSError)
    }
  }
  
  @objc public func getSportXRData (_ resolve: @escaping ([String: Any]) -> Void, reject: @escaping (_ code: String, _ message: String, _ error: NSError) -> Void) {
    TMAuthentication.shared.apigeeConfig { config in
      print("SportXR Data Retrieved")
      let data = [ "sportXRcookieName": config.sportXR?.cookieName ?? "", "sportXRTeamDomain": config.sportXR?.teamDomain ?? ""]
      resolve(data as [String : Any])
    } failure: { error in
      print("SportXR Data Retrieval Error: \(error.localizedDescription)")
      reject( "Accounts SDK SportXR Data Retrieval Error", error.localizedDescription, error as NSError)
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

      // Convert values in an Array to correct bridging value fpr JavaScript
      if let array = value as? [Any] {
          return array.map { convertToDictionary($0) }
      }

      // Convert Struct/Class to correct bridging value for JavaScript i.e. an object
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
  
  
  func sendEvent(_ name: String, body: [String : Any]) {
    GlobalEventEmitter.emitter.sendEvent(withName: name, body: body)
  }
  
  func onStateChanged(backend: TicketmasterAuthentication.TMAuthentication.BackendService?, state: TicketmasterAuthentication.TMAuthentication.ServiceState, error: (Error)?) {
    print("Backend TicketmasterAuthentication \(state.rawValue)")
    switch state{
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



