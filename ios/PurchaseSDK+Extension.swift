import TicketmasterFoundation
import TicketmasterPurchase
import TicketmasterDiscoveryAPI

extension PurchaseSDK: TMPurchaseUserAnalyticsDelegate, TMPurchaseWebAnalyticsDelegate {
  public func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, pageLoadDidErrorFor url: URL, error: NSError) {
    return
  }
  
  public func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, webPageDidErrorFor url: URL, errorString: String) {
    return
  }
  
  public func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, webPageDidReportUALPageView pageView: TicketmasterFoundation.UALPageView) {
    return
  }
  
  public func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, webPageDidReportUALCommerceEvent commerceEvent: TicketmasterFoundation.UALCommerceEvent) {
    return
  }
  
  public func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, didBeginTicketSelectionFor event: TicketmasterDiscoveryAPI.DiscoveryEvent) {
    let date = !event.startDates.isEmpty ? event.startDates[0].description : ""
    
    sendEvent("igniteAnalytics", body: ["purchaseSdkDidBeginTicketSelectionFor": ["eventId": "\(event.eventIdentifier.rawValue)", "legacyId": "\(event.legacyEventIdentifier?.rawValue ?? "")", "eventName": "\(event.name)", "date": "\(date)", "timeZone": "\(event.timeZone?.identifier ?? "")"]])
    return
  }
  
  public func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, didEndTicketSelectionFor event: TicketmasterDiscoveryAPI.DiscoveryEvent, because reason: TicketmasterPurchase.TMEndTicketSelectionReason) {
    let date = !event.startDates.isEmpty ? event.startDates[0].description : ""
    sendEvent("igniteAnalytics", body: ["purchaseSdkDidEndTicketSelectionFor": ["eventId": "\(event.eventIdentifier.rawValue)", "legacyId": "\(event.legacyEventIdentifier?.rawValue ?? "")", "eventName": "\(event.name)", "date": "\(date)", "timeZone": "\(event.timeZone?.identifier ?? "")", "reason": "\(reason)"]])
    
  }
  
  public func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, didBeginCheckoutFor event: TicketmasterDiscoveryAPI.DiscoveryEvent) {
    let date = !event.startDates.isEmpty ? event.startDates[0].description : ""
    sendEvent("igniteAnalytics", body: ["purchaseSdkDidBeginCheckoutFor": ["eventId": "\(event.eventIdentifier.rawValue)", "legacyId": "\(event.legacyEventIdentifier?.rawValue ?? "")", "eventName": "\(event.name)", "date": "\(date)", "timeZone": "\(event.timeZone?.identifier ?? "")"]])
  }
  
  public func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, didEndCheckoutFor event: TicketmasterDiscoveryAPI.DiscoveryEvent, because reason: TicketmasterPurchase.TMEndCheckoutReason) {
    let date = !event.startDates.isEmpty ? event.startDates[0].description : ""
    
    sendEvent("igniteAnalytics", body: ["purchaseSdkDidEndCheckoutFor": ["eventId": "\(event.eventIdentifier.rawValue)", "legacyId": "\(event.legacyEventIdentifier?.rawValue ?? "")", "eventName": "\(event.name)", "date": "\(date)", "timeZone": "\(event.timeZone?.identifier ?? "")", "reason": "\(reason)"]])
  }
  
  public func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, didMakePurchaseFor event: TicketmasterDiscoveryAPI.DiscoveryEvent, order: TicketmasterPurchase.TMPurchaseOrder) {
    let date = !event.startDates.isEmpty ? event.startDates[0].description : ""
    
    sendEvent("igniteAnalytics", body: ["purchaseSdkDidMakePurchaseFor": ["eventId": "\(event.eventIdentifier.rawValue)", "legacyId": "\(event.legacyEventIdentifier?.rawValue ?? "")", "eventName": "\(event.name)", "date": "\(date)", "timeZone": "\(event.timeZone?.identifier ?? "")", "orderId": "\(order.identifier ?? "")", "orderName": "\(order.eventName ?? "")"]])
  }
  
  public func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, didPressNavBarButtonFor event: TicketmasterDiscoveryAPI.DiscoveryEvent, button: TicketmasterPurchase.TMPurchaseNavBarButton) {
    sendEvent("igniteAnalytics", body: ["purchaseSdkDidPressNavBarButtonFor": ["eventId": "\(event.eventIdentifier.rawValue)", "legacyId": "\(event.legacyEventIdentifier?.rawValue ?? "")", "eventName": "\(event.name)", "button": "\(button)"]])
  }
  
  public func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, didShare event: TicketmasterDiscoveryAPI.DiscoveryEvent, activityType: UIActivity.ActivityType) {
    sendEvent("igniteAnalytics",body: ["purchaseSdkDidShare": ["eventId": "\(event.eventIdentifier.rawValue)", "legacyId": "\(event.legacyEventIdentifier?.rawValue ?? "")", "eventName": "\(event.name)", "activityType": "\(activityType)"]])
  }
  
  public func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, didViewSubPageFor event: TicketmasterDiscoveryAPI.DiscoveryEvent, subPage: TicketmasterPurchase.TMPurchaseSubPage) {
    let date = !event.startDates.isEmpty ? event.startDates[0].description : ""
    
    sendEvent("igniteAnalytics", body: ["purchaseSdkDidViewSubPageFor": ["eventId": "\(event.eventIdentifier.rawValue)", "legacyId": "\(event.legacyEventIdentifier?.rawValue ?? "")", "eventName": "\(event.name)", "date": "\(date)", "timeZone": "\(event.timeZone?.identifier ?? "")", "subpage": "\(subPage)"]])
    
  }
  
  public func purchaseNavigationController(_ purchaseNavigationController: TicketmasterPurchase.TMPurchaseNavigationController, didMakeDecisionFor event: TicketmasterDiscoveryAPI.DiscoveryEvent, component: TicketmasterPurchase.TMPurchaseComponent, decision: TicketmasterPurchase.TMPurchaseDecision) {
    let date = !event.startDates.isEmpty ? event.startDates[0].description : ""
    
    sendEvent("igniteAnalytics", body: ["purchaseSdkDidMakeDecisionFor": ["eventId": "\(event.eventIdentifier.rawValue)", "legacyId": "\(event.legacyEventIdentifier?.rawValue ?? "")", "eventName": "\(event.name)", "date": "\(date)", "timeZone": "\(event.timeZone?.identifier ?? "")", "decision": "\(decision)"]])
  }
}
