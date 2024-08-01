import TicketmasterAuthentication
import TicketmasterTickets
import TicketmasterPurchase
import TicketmasterDiscoveryAPI
import TicketmasterFoundation

@objc(PurchaseSDK)
class PurchaseSDK: UIViewController, TMPurchaseUserAnalyticsDelegate, TMPurchaseWebAnalyticsDelegate {
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
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let apiKey = Config.shared.get(for: "apiKey")
        let tmxServiceSettings = TMAuthentication.TMXSettings(apiKey: apiKey,
                                                              region: .US)
        
        let primaryColor = Config.shared.get(for: "primaryColor")
        let backgroundColor = UIColor(hexString: primaryColor) ?? AppConstants.defaultBrandColor
        
        let branding = TMAuthentication.Branding(displayName: Config.shared.get(for: "clientName"), backgroundColor: backgroundColor, theme: .light)
        
        let brandedServiceSettings = TMAuthentication.BrandedServiceSettings(tmxSettings: tmxServiceSettings, branding: branding)
        
        TMPurchase.shared.configure(apiKey: apiKey, completion: {
            isPurchaseApiSet in
            print("Purchase api key set result: \(isPurchaseApiSet)")
            
            TMDiscoveryAPI.shared.configure(apiKey: apiKey, completion: { isDiscoveryApiSet in
                print("Discovery api key set result: \(isDiscoveryApiSet)")
                TMAuthentication.shared.configure(brandedServiceSettings: brandedServiceSettings) { backendsConfigured in
                    
                    TMPurchase.shared.brandColor = backgroundColor!
                    
                    TMTickets.shared.configure {
                        
                        let edpNav = TMPurchaseNavigationController.eventDetailsNavigationController(eventIdentifier: self.eventId, marketDomain: .US)
                        edpNav.modalPresentationStyle = .fullScreen
                        edpNav.userAnalyticsDelegate =  self
                        edpNav.webAnalyticsDelegate =  self
                        self.present(edpNav, animated: false)
                        
                    } failure: { error in
                        // something went wrong, probably TMAuthentication was not configured correctly
                        print(" - Tickets SDK Configuration Error: \(error.localizedDescription)")
                    }
                } failure: { error in
                    // something went wrong, probably the wrong apiKey+region combination
                    print(" - Authentication SDK Configuration Error: \(error.localizedDescription)")
                }
            })
        })
        
    }
    
    func sendEvent(_ name: String, body: [String : Any]) {
        EventEmitter.emitter.sendEvent(withName: name, body: body)
    }
    
    func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, pageLoadDidErrorFor url: URL, error: NSError) {
        return
    }
    
    func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, webPageDidErrorFor url: URL, errorString: String) {
        return
    }
    
    func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, webPageDidReportUALPageView pageView: TicketmasterFoundation.UALPageView) {
        sendEvent("igniteAnalytics", body: ["webPageDidReportUALPageView:": "\(pageView)"])
    }
    
    func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, webPageDidReportUALCommerceEvent commerceEvent: TicketmasterFoundation.UALCommerceEvent) {
        return
    }
    
    func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, didBeginTicketSelectionFor event: TicketmasterDiscoveryAPI.DiscoveryEvent) {
        sendEvent("igniteAnalytics", body: ["didBeginTicketSelectionFor:": "\(event)"])
    }
    
    func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, didEndTicketSelectionFor event: TicketmasterDiscoveryAPI.DiscoveryEvent, because reason: TicketmasterPurchase.TMEndTicketSelectionReason) {
        return
    }
    
    func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, didBeginCheckoutFor event: TicketmasterDiscoveryAPI.DiscoveryEvent) {
        return
    }
    
    func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, didEndCheckoutFor event: TicketmasterDiscoveryAPI.DiscoveryEvent, because reason: TicketmasterPurchase.TMEndCheckoutReason) {
        return
    }
    
    func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, didMakePurchaseFor event: TicketmasterDiscoveryAPI.DiscoveryEvent, order: TicketmasterPurchase.TMPurchaseOrder) {
        return
    }
    
    func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, didPressNavBarButtonFor event: TicketmasterDiscoveryAPI.DiscoveryEvent, button: TicketmasterPurchase.TMPurchaseNavBarButton) {
        return
    }
    
    func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, didShare event: TicketmasterDiscoveryAPI.DiscoveryEvent, activityType: UIActivity.ActivityType) {
        return
    }
    
    func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, didViewSubPageFor event: TicketmasterDiscoveryAPI.DiscoveryEvent, subPage: TicketmasterPurchase.TMPurchaseSubPage) {
        sendEvent("igniteAnalytics", body: ["didViewSubPageFor:": "\(event)"])
    }
    
    func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, didMakeDecisionFor event: TicketmasterDiscoveryAPI.DiscoveryEvent, component: TicketmasterPurchase.TMPurchaseComponent, decision: TicketmasterPurchase.TMPurchaseDecision) {
        return
    }
}


