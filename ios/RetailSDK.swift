import TicketmasterAuthentication

@objc(RetailSDK)
class RetailSDK: NSObject {
  @objc public func presentPrePurchaseVenue(_ venueId: String) {
    let viewController = PrePurchaseSDK()
    viewController.setVenueId(venueId)
    viewController.modalPresentationStyle = .custom
    UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }.first?.keyWindow?.rootViewController?.present(viewController, animated: true)
  }

    @objc public func presentPrePurchaseAttraction(_ attractionId: String) {
    let viewController = PrePurchaseSDK()
    viewController.setAttractionId(attractionId)
    viewController.modalPresentationStyle = .custom
    UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }.first?.keyWindow?.rootViewController?.present(viewController, animated: true)
  }

  @objc public func presentPurchase(_ eventId: String) {
      let viewController = PurchaseSDK()
      viewController.setEventId(eventId)
      viewController.modalPresentationStyle = .custom
      UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }.first?.keyWindow?.rootViewController?.present(viewController, animated: true)
  }
}
