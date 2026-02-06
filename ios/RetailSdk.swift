import Foundation
import UIKit

@objcMembers public class RetailSdk: NSObject {

  public func presentPrePurchaseVenue(venueId: String) {
    DispatchQueue.main.async {
      let viewController = PrePurchaseSdk()
      viewController.setVenueId(venueId)
      viewController.modalPresentationStyle = .custom
      self.getRootViewController()?.present(viewController, animated: true)
    }
  }

  public func presentPrePurchaseAttraction(attractionId: String) {
    DispatchQueue.main.async {
      let viewController = PrePurchaseSdk()
      viewController.setAttractionId(attractionId)
      viewController.modalPresentationStyle = .custom
      self.getRootViewController()?.present(viewController, animated: true)
    }
  }

  public func presentPurchase(eventId: String) {
    DispatchQueue.main.async {
      let viewController = PurchaseSdk()
      viewController.setEventId(eventId)
      viewController.modalPresentationStyle = .custom
      self.getRootViewController()?.present(viewController, animated: true)
    }
  }

  private func getRootViewController() -> UIViewController? {
    return UIApplication.shared.connectedScenes
      .compactMap { $0 as? UIWindowScene }
      .first?.keyWindow?.rootViewController
  }
}
