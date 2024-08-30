import TicketmasterAuthentication
import TicketmasterTickets
import TicketmasterDiscoveryAPI
import TicketmasterPrePurchase
import TicketmasterPurchase
import TicketmasterFoundation

@objc(PrePurchaseSDK)
class PrePurchaseSDK: UIViewController, TMPrePurchaseNavigationDelegate {
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
        let primaryColor = Config.shared.get(for: "primaryColor")
        let backgroundColor = UIColor(hexString: primaryColor) ?? AppConstants.defaultBrandColor

        TMPrePurchase.shared.brandColor = backgroundColor!
        TMPrePurchase.shared.configure(apiKey: apiKey, completion: { isPrePurchaseApiSet in
            print("PrePurchase api key set result: \(isPrePurchaseApiSet)")
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
            self.present(viewController, animated: false)
        })
    }
    
    
    func sendEvent(_ name: String, body: [String : Any]) {
        EventEmitter.emitter.sendEvent(withName: name, body: body)
    }
    
//    func prePurchaseViewController(_ viewController: TicketmasterPrePurchase.TMPrePurchaseViewController, didShare pageTitle: String, and pageURL: URL, to activityType: UIActivity.ActivityType) {
//        sendEvent("igniteAnalytics", body: ["prePurchaseSdkDidShare": "\(pageTitle)"])
//    }
//    
    func prePurchaseViewController(_ viewController: TicketmasterPrePurchase.TMPrePurchaseViewController, didFirePageView pageView: TicketmasterFoundation.UALPageView) {
//        sendEvent("igniteAnalytics", body: ["prePurchaseSdkDidFirePageView": "\(pageView)"])
        return
    }
    
    func prePurchaseViewController(_ viewController: TicketmasterPrePurchase.TMPrePurchaseViewController, navigateToEventDetailsPageWithIdentifier eventIdentifier: String) {
        let configuration = TMPurchaseWebsiteConfiguration(eventID: eventIdentifier)
        let apiKey = Config.shared.get(for: "apiKey")
        TMPurchase.shared.configure(apiKey: apiKey, completion: {isPurchaseApiSet in
            TMDiscoveryAPI.shared.configure(apiKey: apiKey, completion: { isDiscoveryApiSet in
                if (isDiscoveryApiSet && isPurchaseApiSet) {
                    let purchaseNavController = TMPurchaseNavigationController(configuration: configuration)
                    viewController.present(purchaseNavController, animated: true, completion: nil)
                }
            })
        })
    }
}
