import TicketmasterAuthentication
import TicketmasterTickets


@objc(AccountsSDK)
class AccountsSDK: NSObject, TMAuthenticationDelegate  {
    
    @objc public func configureAccountsSDK(_ resolve: @escaping (String) -> Void, reject: @escaping (_ code: String, _ message: String, _ error: NSError) -> Void) {
        
        TMAuthentication.shared.delegate = self
        
        // build a combination of Settings and Branding
        let apiKey = Config.shared.get(for: "apiKey")
        let tmxServiceSettings = TMAuthentication.TMXSettings(apiKey: apiKey,
                                                              region: .US)
        
        let primaryColor = Config.shared.get(for: "primaryColor")
        let backgroundColor = UIColor(hexString: primaryColor) ?? AppConstants.defaultBrandColor
        let branding = TMAuthentication.Branding(displayName: Config.shared.get(for: "clientName"), backgroundColor: backgroundColor, theme: .light)
        
        let brandedServiceSettings = TMAuthentication.BrandedServiceSettings(tmxSettings: tmxServiceSettings,
                                                                             branding: branding)
        
        // configure TMAuthentication with Settings and Branding
        print("Authentication SDK Configuring...")
        
        TMAuthentication.shared.configure(brandedServiceSettings: brandedServiceSettings) { backendsConfigured in
            // your API key may contain configurations for multiple backend services
            // the details are not needed for most common use-cases
            print(" - Authentication SDK Configured: \(backendsConfigured.count)")
            resolve("Authentication SDK configuration successful")
        } failure: { error in
            // something went wrong, probably the wrong apiKey+region combination
            print(" - Authentication SDK Configuration Error: \(error.localizedDescription)")
            reject( "Authentication SDK Configuration Error:", error.localizedDescription, error as NSError)
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
        
        TMAuthentication.shared.logout { backends in
            resolve("Logout Successful")
            print("Logout Completed")
            print(" - Backends Count: \(backends?.count ?? 0)")
        }
    }
    
    @objc public func refreshToken(_ resolve: @escaping ([String: Any]) -> Void, reject: @escaping (_ code: String, _ message: String, _ error: NSError) -> Void) {
        
        TMAuthentication.shared.validToken { authToken in
            print("Token Refreshed (if needed)")
            print(" - AuthToken: \(authToken.accessToken.prefix(20))...")
            let data = ["accessToken": authToken.accessToken]
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
    
    @objc public func getMemberInfo(_ resolve: @escaping ([String: Any]) -> Void, reject: @escaping (_ code: String, _ message: String, _ error: NSError) -> Void) {
        
        TMAuthentication.shared.memberInfo { memberInfo in
            print("MemberInfo Completed")
            print(" - UserID: \(memberInfo.localID ?? "<nil>")")
            print(" - Email: \(memberInfo.email ?? "<nil>")")
            print(memberInfo)
            let data = ["globalUserId": memberInfo.globalID, "memberId": memberInfo.localID,  "hmacId": memberInfo.hmacID, "firstName": memberInfo.firstName, "lastName": memberInfo.lastName, "email": memberInfo.email, "phone": memberInfo.phone, "preferredLang": memberInfo.language]
            resolve(data as [String : Any])
        } failure: { oldMemberInfo, error, backend in
            print("MemberInfo Error: \(error.localizedDescription)")
            reject( "Accounts SDK Member Info Error", error.localizedDescription, error as NSError)
        }
    }
    
    @objc public func getToken(_ resolve: @escaping ([String: Any]) -> Void, reject: @escaping (_ code: String, _ message: String, _ error: NSError) -> Void) {
        TMAuthentication.shared.validToken(showLoginIfNeeded: false) { authToken in
            print("Token Retrieved")
            let data = ["accessToken": authToken.accessToken]
            resolve(data)
        } aborted: { oldAuthToken, backend in
            print("Token Retrieval Aborted ")
            let data = ["accessToken": ""]
            resolve(data)
        } failure: { oldAuthToken, error, backend in
            print("Token Retrieval Error: \(error.localizedDescription)")
            reject( "Accounts SDK Token Retrieval Error", error.localizedDescription, error as NSError)
        }
    }
    
    @objc public func isLoggedIn(_ resolve: @escaping ([String: Bool]) -> Void, reject: @escaping (_ code: String, _ message: String, _ error: NSError) -> Void) {
        
        TMAuthentication.shared.memberInfo { memberInfo in
            guard let id = memberInfo.globalID else {
                resolve(["result": false])
                return
            }
            
            let hasToken = TMAuthentication.shared.hasToken()
            resolve(["result": hasToken])
            
        } failure: { oldMemberInfo, error, backend in
            reject("Accounts SDK Is Logged In Error", error.localizedDescription, error as NSError)
        }
    }
    
    
    func sendEvent(_ name: String, body: [String : Any]) {
        EventEmitter.emitter.sendEvent(withName: name, body: body)
    }
    
    func onStateChanged(backend: TicketmasterAuthentication.TMAuthentication.BackendService?, state: TicketmasterAuthentication.TMAuthentication.ServiceState, error: (Error)?) {
        print("Backend TicketmasterAuthentication \(state.rawValue)")
        switch state{
        case .serviceConfigurationStarted:
            return
        case .serviceConfigured:
            return
        case .serviceConfigurationCompleted:
            return
        case .loginStarted:
            sendEvent("igniteAnalytics", body: ["AccountsSDK - loginStarted:": "loginStarted event sent"])
            return
        case .loginPresented:
            return
        case .loggedIn:
            return
        case .loginAborted:
            return
        case .loginFailed:
            return
        case .loginLinkAccountPresented:
            return
        case .loginCompleted:
            return
        case .tokenRefreshed:
            return
        case .logoutStarted:
            return
        case .loggedOut:
            return
        case .logoutCompleted:
            return
        @unknown default:
            return
        }
    }
}



