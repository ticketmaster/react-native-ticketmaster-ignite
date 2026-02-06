import Foundation
import UIKit
import TicketmasterAuthentication
import TicketmasterPurchase

class PurchaseSdk: UIViewController {

  var eventId: String = ""

  var firstRender: Bool = true

  func setEventId(_ eventId: String) {
    self.eventId = eventId
  }

  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
    if firstRender {
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

    let apiKey = Config.shared.get(for: "apiKey")
    let region = Config.shared.get(for: "region")
    let primaryColor = Config.shared.get(for: "primaryColor")
    let backgroundColor = UIColor(hexString: primaryColor) ?? AppConstants.defaultBrandColor
    let eventHeaderTypeString = Config.shared.get(for: "eventHeaderType")
    let eventHeaderType = EventHeaderType(rawValue: eventHeaderTypeString)
    let marketDomain = MarketDomainObject.shared.getMarketDomain()

    TMPurchase.shared.configure(apiKey: apiKey, region: TMAuthentication.TMXDeploymentRegion(rawValue: region) ?? .US) { isPurchaseApiSet in
      print("Purchase api key set result: \(isPurchaseApiSet)")

      TMPurchase.shared.brandColor = backgroundColor!
      TMPurchase.shared.marketDomain = marketDomain

      let headerConfig = TMPurchaseWebsiteConfiguration(eventID: self.eventId)
      headerConfig.showInfoToolbarButton = (eventHeaderType == .eventInfo || eventHeaderType == .eventInfoShare)
      headerConfig.showShareToolbarButton = (eventHeaderType == .eventShare || eventHeaderType == .eventInfoShare)

      let edpNav = TMPurchaseNavigationController(configuration: headerConfig)
      edpNav.modalPresentationStyle = .fullScreen
      edpNav.userAnalyticsDelegate = PurchaseAnalyticsHandler.shared
      edpNav.webAnalyticsDelegate = PurchaseAnalyticsHandler.shared
      self.present(edpNav, animated: false)
    }
  }
}

