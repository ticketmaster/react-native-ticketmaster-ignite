import TicketmasterAuthentication
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
    let region = Config.shared.get(for: "region")
    let primaryColor = Config.shared.get(for: "primaryColor")
    let backgroundColor = UIColor(hexString: primaryColor) ?? AppConstants.defaultBrandColor
    
    
    TMPurchase.shared.configure(apiKey: apiKey, region: TMAuthentication.TMXDeploymentRegion(rawValue: region) ?? .US, completion: { isPurchaseApiSet in
      print("Purchase api key set result: \(isPurchaseApiSet)")
      
      TMPurchase.shared.brandColor = backgroundColor!
      
      let edpNav = TMPurchaseNavigationController.eventDetailsNavigationController(eventIdentifier: self.eventId, marketDomain: .US)
      edpNav.modalPresentationStyle = .fullScreen
      edpNav.userAnalyticsDelegate =  self
      edpNav.webAnalyticsDelegate =  self
      self.present(edpNav, animated: false)
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
    return
  }
  
  func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, webPageDidReportUALCommerceEvent commerceEvent: TicketmasterFoundation.UALCommerceEvent) {
    return
  }
  
  func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, didBeginTicketSelectionFor event: TicketmasterDiscoveryAPI.DiscoveryEvent) {
    sendEvent("igniteAnalytics", body: ["purchaseSdkDidBeginTicketSelectionFor": ["eventId": "\(event.eventIdentifier.rawValue)", "legacyId": "\(event.legacyEventIdentifier?.rawValue ?? "")", "eventName": "\(event.name)", "date": "\(event.startDates[0])", "timeZone": "\(event.timeZone?.identifier ?? "")"]])
    return
  }
  
  func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, didEndTicketSelectionFor event: TicketmasterDiscoveryAPI.DiscoveryEvent, because reason: TicketmasterPurchase.TMEndTicketSelectionReason) {
    sendEvent("igniteAnalytics", body: ["purchaseSdkDidEndTicketSelectionFor": ["eventId": "\(event.eventIdentifier.rawValue)", "legacyId": "\(event.legacyEventIdentifier?.rawValue ?? "")", "eventName": "\(event.name)", "date": "\(event.startDates[0])", "timeZone": "\(event.timeZone?.identifier ?? "")", "reason": "\(reason)"]])
    
  }
  
  func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, didBeginCheckoutFor event: TicketmasterDiscoveryAPI.DiscoveryEvent) {
    sendEvent("igniteAnalytics", body: ["purchaseSdkDidBeginCheckoutFor": ["eventId": "\(event.eventIdentifier.rawValue)", "legacyId": "\(event.legacyEventIdentifier?.rawValue ?? "")", "eventName": "\(event.name)", "date": "\(event.startDates[0])", "timeZone": "\(event.timeZone?.identifier ?? "")"]])
  }
  
  func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, didEndCheckoutFor event: TicketmasterDiscoveryAPI.DiscoveryEvent, because reason: TicketmasterPurchase.TMEndCheckoutReason) {
    sendEvent("igniteAnalytics", body: ["purchaseSdkDidEndCheckoutFor": ["eventId": "\(event.eventIdentifier.rawValue)", "legacyId": "\(event.legacyEventIdentifier?.rawValue ?? "")", "eventName": "\(event.name)", "date": "\(event.startDates[0])", "timeZone": "\(event.timeZone?.identifier ?? "")", "reason": "\(reason)"]])
  }
  
  func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, didMakePurchaseFor event: TicketmasterDiscoveryAPI.DiscoveryEvent, order: TicketmasterPurchase.TMPurchaseOrder) {
    sendEvent("igniteAnalytics", body: ["purchaseSdkDidMakePurchaseFor": ["eventId": "\(event.eventIdentifier.rawValue)", "legacyId": "\(event.legacyEventIdentifier?.rawValue ?? "")", "eventName": "\(event.name)", "date": "\(event.startDates[0])", "timeZone": "\(event.timeZone?.identifier ?? "")", "orderId": "\(order.identifier ?? "")", "orderName": "\(order.eventName ?? "")"]])
  }
  
  func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, didPressNavBarButtonFor event: TicketmasterDiscoveryAPI.DiscoveryEvent, button: TicketmasterPurchase.TMPurchaseNavBarButton) {
    sendEvent("igniteAnalytics", body: ["purchaseSdkDidPressNavBarButtonFor": ["eventId": "\(event.eventIdentifier.rawValue)", "legacyId": "\(event.legacyEventIdentifier?.rawValue ?? "")", "eventName": "\(event.name)", "button": "\(button)"]])
  }
  
  func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, didShare event: TicketmasterDiscoveryAPI.DiscoveryEvent, activityType: UIActivity.ActivityType) {
    sendEvent("igniteAnalytics",body: ["purchaseSdkDidShare": ["eventId": "\(event.eventIdentifier.rawValue)", "legacyId": "\(event.legacyEventIdentifier?.rawValue ?? "")", "eventName": "\(event.name)", "activityType": "\(activityType)"]])
  }
  
  func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, didViewSubPageFor event: TicketmasterDiscoveryAPI.DiscoveryEvent, subPage: TicketmasterPurchase.TMPurchaseSubPage) {
    sendEvent("igniteAnalytics", body: ["purchaseSdkDidViewSubPageFor": ["eventId": "\(event.eventIdentifier.rawValue)", "legacyId": "\(event.legacyEventIdentifier?.rawValue ?? "")", "eventName": "\(event.name)", "date": "\(event.startDates[0])", "timeZone": "\(event.timeZone?.identifier ?? "")", "subpage": "\(subPage)"]])
    
  }
  
  func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, didMakeDecisionFor event: TicketmasterDiscoveryAPI.DiscoveryEvent, component: TicketmasterPurchase.TMPurchaseComponent, decision: TicketmasterPurchase.TMPurchaseDecision) {
    sendEvent("igniteAnalytics", body: ["purchaseSdkDidMakeDecisionFor": ["eventId": "\(event.eventIdentifier.rawValue)", "legacyId": "\(event.legacyEventIdentifier?.rawValue ?? "")", "eventName": "\(event.name)", "date": "\(event.startDates[0])", "timeZone": "\(event.timeZone?.identifier ?? "")", "decision": "\(decision)"]])
  }
}


