import TicketmasterAuthentication
@objc(RetailSDK)
class RetailSDK: NSObject {
  @objc public func presentPrePurchaseVenue(_ venueId: String) {
    let viewController = PrePurchaseSDK()
    viewController.setVenueId(venueId)
    viewController.modalPresentationStyle = .custom
    UIApplication.shared.windows.filter {$0.isKeyWindow}.first?.rootViewController?.present(viewController, animated: true)
  }

    @objc public func presentPrePurchaseAttraction(_ attractionId: String) {
    let viewController = PrePurchaseSDK()
    viewController.setAttractionId(attractionId)
    viewController.modalPresentationStyle = .custom
    UIApplication.shared.windows.filter {$0.isKeyWindow}.first?.rootViewController?.present(viewController, animated: true)
  }

  @objc public func presentPurchase(_ eventId: String) {
    PurchaseSDK.loadSDKView(eventId)
  }
}
