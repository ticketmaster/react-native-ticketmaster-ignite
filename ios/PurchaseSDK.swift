import TicketmasterAuthentication
import TicketmasterPurchase

@objc(PurchaseSDK)
class PurchaseSDK: UIViewController {
  var eventId: String = ""
  
  var firstRender: Bool = true
  
  func setEventId(_ eventId: String) {
    self.eventId = eventId
  }
  
  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
    if (firstRender) {
      firstRender = false
    } else {
      self.dismiss(animated: true)
    }
  }

  enum EventHeaderType: String {
      case noToolbars = "NO_TOOLBARS"
      case eventInfo = "EVENT_INFO"
      case eventShare = "EVENT_SHARE"
      case eventInfoShare = "EVENT_INFO_SHARE"
  }
  
  override func viewDidLoad() {
    super.viewDidLoad()
    
    // TMPurchase.shared.configure also needs to be configured in PrePurchaseSDK+Extension
    let apiKey = Config.shared.get(for: "apiKey")
    let region = Config.shared.get(for: "region")
    let primaryColor = Config.shared.get(for: "primaryColor")
    let marketDomainConfig = Config.shared.get(for: "marketDomain")
    let backgroundColor = UIColor(hexString: primaryColor) ?? AppConstants.defaultBrandColor
    let eventHeaderTypeString = Config.shared.get(for: "eventHeaderType")
    let eventHeaderType = EventHeaderType(rawValue: eventHeaderTypeString)
    let marketDomain = MarketDomainObject.shared.getMarketDomain(marketDomainConfig: marketDomainConfig)
    
    TMPurchase.shared.configure(apiKey: apiKey, region: TMAuthentication.TMXDeploymentRegion(rawValue: region) ?? .US, completion: { isPurchaseApiSet in
      print("Purchase api key set result: \(isPurchaseApiSet)")
      
      TMPurchase.shared.brandColor = backgroundColor!
      TMPurchase.shared.marketDomain = marketDomain

      let headerConfig = TMPurchaseWebsiteConfiguration(eventID: self.eventId)
      headerConfig.showInfoToolbarButton = (eventHeaderType == .eventInfo || eventHeaderType == .eventInfoShare)
      headerConfig.showShareToolbarButton = (eventHeaderType == .eventShare || eventHeaderType == .eventInfoShare)

      let edpNav = TMPurchaseNavigationController(configuration: headerConfig)
      edpNav.modalPresentationStyle = .fullScreen
      edpNav.userAnalyticsDelegate =  self
      edpNav.webAnalyticsDelegate =  self
      self.present(edpNav, animated: false)
    })
  }
}


