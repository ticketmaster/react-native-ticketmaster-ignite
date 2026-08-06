import TicketmasterFoundation
import TicketmasterPurchase
import TicketmasterDiscoveryAPI

class PurchaseAnalyticsHandler: NSObject, TMPurchaseUserAnalyticsDelegate, TMPurchaseWebAnalyticsDelegate {

  static let shared = PurchaseAnalyticsHandler()

  public func purchaseNavigationController(
    _ purchaseNavigationController: TMPurchaseNavigationController,
    pageLoadDidErrorFor url: URL,
    error: NSError
  ) {
    print("PurchaseWebAnalytics - pageLoadDidErrorFor: url=\(url), error=\(error.localizedDescription)")
    GlobalEventEmitter.sendEvent(
      name: "igniteAnalytics",
      body: [
        "purchaseSdkDidErrorOnPageLoad": [
          "url": "\(url.absoluteString)",
          "error": "\(error.localizedDescription)"
        ]
      ]
    )
  }

  public func purchaseNavigationController(
    _ purchaseNavigationController: TMPurchaseNavigationController,
    webPageDidErrorFor url: URL,
    errorString: String
  ) {
    print("PurchaseWebAnalytics - webPageDidErrorFor: url=\(url), error=\(errorString)")
    GlobalEventEmitter.sendEvent(
      name: "igniteAnalytics",
      body: [
        "purchaseSdkDidErrorOnWebpage": [
          "url": "\(url.absoluteString)",
          "error": "\(errorString)"
        ]
      ]
    )
  }

  public func purchaseNavigationController(
    _ purchaseNavigationController: TMPurchaseNavigationController,
    webPageDidReportUALPageView pageView: UALPageView
  ) {
    print("PurchaseWebAnalytics - UALPageView: pageName=\(pageView.pageName ?? ""), pageUrl=\(pageView.pageUrl ?? ""), pageType=\(pageView.pageType ?? "")")
    GlobalEventEmitter.sendEvent(
      name: "igniteAnalytics",
      body: [
        "purchaseSdkDidReportUalPageView": [
          "pageName": "\(pageView.pageName ?? "")",
          "pageUrl": "\(pageView.pageUrl ?? "")",
          "pageReferrer": "\(pageView.pageReferrer ?? "")",
          "pageType": "\(pageView.pageType ?? "")"
        ]
      ]
    )
  }

  public func purchaseNavigationController(
    _ purchaseNavigationController: TMPurchaseNavigationController,
    webPageDidReportUALCommerceEvent commerceEvent: UALCommerceEvent
  ) {
    print("PurchaseWebAnalytics - UALCommerceEvent: eventType=\(commerceEvent.eventType ?? ""), eventName=\(commerceEvent.eventName ?? ""), transactionId=\(commerceEvent.transactionId ?? "")")
    GlobalEventEmitter.sendEvent(
      name: "igniteAnalytics",
      body: [
        "purchaseSdkDidReportUalCommerceEvent": [
          "eventType": "\(commerceEvent.eventType ?? "")",
          "eventName": "\(commerceEvent.eventName ?? "")",
          "transactionId": "\(commerceEvent.transactionId ?? "")",
          "transactionTotal": "\(commerceEvent.transactionTotal ?? 0.0)"
        ]
      ]
    )
  }

  // MARK: - TMPurchaseUserAnalyticsDelegate

  public func purchaseNavigationController(
    _ purchaseNavigationController: TMPurchaseNavigationController,
    didBeginTicketSelectionFor event: DiscoveryEvent
  ) {
    let date = !event.startDates.isEmpty ? event.startDates[0].description : ""

    GlobalEventEmitter.sendEvent(
      name: "igniteAnalytics",
      body: [
        "purchaseSdkDidBeginTicketSelectionFor": [
          "eventId": "\(event.eventIdentifier.rawValue)",
          "legacyId": "\(event.legacyEventIdentifier?.rawValue ?? "")",
          "eventName": "\(event.name)",
          "date": "\(date)",
          "timeZone": "\(event.timeZone?.identifier ?? "")"
        ]
      ]
    )
  }

  public func purchaseNavigationController(
    _ purchaseNavigationController: TMPurchaseNavigationController,
    didEndTicketSelectionFor event: DiscoveryEvent,
    because reason: TMEndTicketSelectionReason
  ) {
    let date = !event.startDates.isEmpty ? event.startDates[0].description : ""

    GlobalEventEmitter.sendEvent(
      name: "igniteAnalytics",
      body: [
        "purchaseSdkDidEndTicketSelectionFor": [
          "eventId": "\(event.eventIdentifier.rawValue)",
          "legacyId": "\(event.legacyEventIdentifier?.rawValue ?? "")",
          "eventName": "\(event.name)",
          "date": "\(date)",
          "timeZone": "\(event.timeZone?.identifier ?? "")",
          "reason": "\(reason)"
        ]
      ]
    )
  }

  public func purchaseNavigationController(
    _ purchaseNavigationController: TMPurchaseNavigationController,
    didBeginCheckoutFor event: DiscoveryEvent
  ) {
    let date = !event.startDates.isEmpty ? event.startDates[0].description : ""

    GlobalEventEmitter.sendEvent(
      name: "igniteAnalytics",
      body: [
        "purchaseSdkDidBeginCheckoutFor": [
          "eventId": "\(event.eventIdentifier.rawValue)",
          "legacyId": "\(event.legacyEventIdentifier?.rawValue ?? "")",
          "eventName": "\(event.name)",
          "date": "\(date)",
          "timeZone": "\(event.timeZone?.identifier ?? "")"
        ]
      ]
    )
  }

  public func purchaseNavigationController(
    _ purchaseNavigationController: TMPurchaseNavigationController,
    didEndCheckoutFor event: DiscoveryEvent,
    because reason: TMEndCheckoutReason
  ) {
    let date = !event.startDates.isEmpty ? event.startDates[0].description : ""

    GlobalEventEmitter.sendEvent(
      name: "igniteAnalytics",
      body: [
        "purchaseSdkDidEndCheckoutFor": [
          "eventId": "\(event.eventIdentifier.rawValue)",
          "legacyId": "\(event.legacyEventIdentifier?.rawValue ?? "")",
          "eventName": "\(event.name)",
          "date": "\(date)",
          "timeZone": "\(event.timeZone?.identifier ?? "")",
          "reason": "\(reason)"
        ]
      ]
    )
  }

  public func purchaseNavigationController(
    _ purchaseNavigationController: TMPurchaseNavigationController,
    didMakePurchaseFor event: DiscoveryEvent,
    order: TMPurchaseOrder
  ) {
    let date = !event.startDates.isEmpty ? event.startDates[0].description : ""

    GlobalEventEmitter.sendEvent(
      name: "igniteAnalytics",
      body: [
        "purchaseSdkDidMakePurchaseFor": [
          "eventId": "\(event.eventIdentifier.rawValue)",
          "legacyId": "\(event.legacyEventIdentifier?.rawValue ?? "")",
          "eventName": "\(event.name)",
          "date": "\(date)",
          "timeZone": "\(event.timeZone?.identifier ?? "")",
          "orderId": "\(order.identifier ?? "")",
          "orderName": "\(order.eventName ?? "")"
        ]
      ]
    )
  }

  public func purchaseNavigationController(
    _ purchaseNavigationController: TMPurchaseNavigationController,
    didPressNavBarButtonFor event: DiscoveryEvent,
    button: TMPurchaseNavBarButton
  ) {
    GlobalEventEmitter.sendEvent(
      name: "igniteAnalytics",
      body: [
        "purchaseSdkDidPressNavBarButtonFor": [
          "eventId": "\(event.eventIdentifier.rawValue)",
          "legacyId": "\(event.legacyEventIdentifier?.rawValue ?? "")",
          "eventName": "\(event.name)",
          "button": "\(button)"
        ]
      ]
    )
  }

  public func purchaseNavigationController(
    _ purchaseNavigationController: TMPurchaseNavigationController,
    didShare event: DiscoveryEvent,
    activityType: UIActivity.ActivityType
  ) {
    GlobalEventEmitter.sendEvent(
      name: "igniteAnalytics",
      body: [
        "purchaseSdkDidShare": [
          "eventId": "\(event.eventIdentifier.rawValue)",
          "legacyId": "\(event.legacyEventIdentifier?.rawValue ?? "")",
          "eventName": "\(event.name)",
          "activityType": "\(activityType)"
        ]
      ]
    )
  }

  public func purchaseNavigationController(
    _ purchaseNavigationController: TMPurchaseNavigationController,
    didViewSubPageFor event: DiscoveryEvent,
    subPage: TMPurchaseSubPage
  ) {
    let date = !event.startDates.isEmpty ? event.startDates[0].description : ""

    GlobalEventEmitter.sendEvent(
      name: "igniteAnalytics",
      body: [
        "purchaseSdkDidViewSubPageFor": [
          "eventId": "\(event.eventIdentifier.rawValue)",
          "legacyId": "\(event.legacyEventIdentifier?.rawValue ?? "")",
          "eventName": "\(event.name)",
          "date": "\(date)",
          "timeZone": "\(event.timeZone?.identifier ?? "")",
          "subpage": "\(subPage)"
        ]
      ]
    )
  }

  public func purchaseNavigationController(
    _ purchaseNavigationController: TMPurchaseNavigationController,
    didMakeDecisionFor event: DiscoveryEvent,
    component: TMPurchaseComponent,
    decision: TMPurchaseDecision
  ) {
    let date = !event.startDates.isEmpty ? event.startDates[0].description : ""

    GlobalEventEmitter.sendEvent(
      name: "igniteAnalytics",
      body: [
        "purchaseSdkDidMakeDecisionFor": [
          "eventId": "\(event.eventIdentifier.rawValue)",
          "legacyId": "\(event.legacyEventIdentifier?.rawValue ?? "")",
          "eventName": "\(event.name)",
          "date": "\(date)",
          "timeZone": "\(event.timeZone?.identifier ?? "")",
          "decision": "\(decision)"
        ]
      ]
    )
  }
}
