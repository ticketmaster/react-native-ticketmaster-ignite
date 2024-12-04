import TicketmasterFoundation
import TicketmasterAuthentication
import TicketmasterDiscoveryAPI
import TicketmasterPrePurchase
import TicketmasterPurchase

extension PrePurchaseSDK: TMPrePurchaseNavigationDelegate, TMPrePurchaseAnalyticsDelegate {
  
  public func prePurchaseViewController(_ viewController: TicketmasterPrePurchase.TMPrePurchaseViewController, didShare pageTitle: String, and pageURL: URL, to activityType: UIActivity.ActivityType) {
    return
  }
  
  public func prePurchaseViewController(_ viewController: TicketmasterPrePurchase.TMPrePurchaseViewController, didFirePageView pageView: TicketmasterFoundation.UALPageView) {
    //    sendEvent("igniteAnalytics", body: ["prePurchaseSdkDidFirePageView": "\(pageView)"])
    return
  }
  
  public func prePurchaseViewController(_ viewController: TicketmasterPrePurchase.TMPrePurchaseViewController, navigateToEventDetailsPageWithIdentifier eventIdentifier: String) {
    
    enum EventHeaderType: String {
        case noToolbars = "NO_TOOLBARS"
        case eventInfo = "EVENT_INFO"
        case eventShare = "EVENT_SHARE"
        case eventInfoShare = "EVENT_INFO_SHARE"
    }
    
    let apiKey = Config.shared.get(for: "apiKey")
    let region = Config.shared.get(for: "region")
    let primaryColor = Config.shared.get(for: "primaryColor")
    let backgroundColor = UIColor(hexString: primaryColor) ?? AppConstants.defaultBrandColor
    let eventHeaderTypeString = Config.shared.get(for: "eventHeaderType")
    let eventHeaderType = EventHeaderType(rawValue: eventHeaderTypeString)
    let marketDomain = MarketDomainObject.shared.getMarketDomain()
    
    TMPurchase.shared.configure(apiKey: apiKey, region: TMAuthentication.TMXDeploymentRegion(rawValue: region) ?? .US, completion: {isPurchaseApiSet in
      print("Purchase api key set result: \(isPurchaseApiSet)")
      
      TMPurchase.shared.brandColor = backgroundColor!
      TMPurchase.shared.marketDomain = marketDomain
      
      let headerConfig = TMPurchaseWebsiteConfiguration(eventID: eventIdentifier)
      headerConfig.showInfoToolbarButton = (eventHeaderType == .eventInfo || eventHeaderType == .eventInfoShare)
      headerConfig.showShareToolbarButton = (eventHeaderType == .eventShare || eventHeaderType == .eventInfoShare)
      
      TMDiscoveryAPI.shared.configure(apiKey: apiKey, region: TMAuthentication.TMXDeploymentRegion(rawValue: region) ?? .US, completion: { isDiscoveryApiSet in
        
        TMDiscoveryAPI.shared.marketDomain = marketDomain
        
        if (isDiscoveryApiSet && isPurchaseApiSet) {
          let purchaseNavController = TMPurchaseNavigationController(configuration: headerConfig)
          viewController.present(purchaseNavController, animated: true, completion: nil)
        }
      })
    })
  }
}
