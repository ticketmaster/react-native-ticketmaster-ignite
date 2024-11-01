import TicketmasterAuthentication
import TicketmasterPrePurchase

@objc(PrePurchaseSDK)
class PrePurchaseSDK: UIViewController {
  
  var venueId: String = ""
  var attractionId: String = ""
  
  var firstRender: Bool = true
  
  func setVenueId(_ venueId: String) {
    self.venueId = venueId
  }
  
  func setAttractionId(_ attractionId: String) {
    self.attractionId = attractionId
  }
  
  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
    if (firstRender) {
      firstRender = false
    } else {
      self.dismiss(animated: true)
    }
  }
  
  override func viewDidLoad() {
    super.viewDidLoad()
    
    let apiKey = Config.shared.get(for: "apiKey")
    let region = Config.shared.get(for: "region")
    let primaryColor = Config.shared.get(for: "primaryColor")
    let backgroundColor = UIColor(hexString: primaryColor) ?? AppConstants.defaultBrandColor
    
    TMPrePurchase.shared.configure(apiKey: apiKey, region: TMAuthentication.TMXDeploymentRegion(rawValue: region) ?? .US, completion: { isPrePurchaseApiSet in
      print("PrePurchase api key set result: \(isPrePurchaseApiSet)")
      
      TMPrePurchase.shared.brandColor = backgroundColor!
      
      var viewController: TMPrePurchaseViewController
      
      if (self.venueId != "") {
        print("Set viewController to Venue")
        viewController = TMPrePurchaseViewController.venueDetailsViewController(venueIdentifier: self.venueId, enclosingEnvironment: .modalPresentation)
      } else {
        print("Set viewController to Attraction")
        viewController = TMPrePurchaseViewController.attractionDetailsViewController(attractionIdentifier: self.attractionId, enclosingEnvironment: .modalPresentation)
      }
      
      viewController.modalPresentationStyle = .fullScreen
      viewController.navigationDelegate = self
      viewController.analyticsDelegate = self
      self.present(viewController, animated: false)
    })
  }
}
