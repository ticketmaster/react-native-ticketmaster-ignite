import Foundation
import UIKit

@objcMembers public class RetailSDK: NSObject {

  public func presentPrePurchaseVenue(venueId: String) {
    DispatchQueue.main.async {
      let viewController = PrePurchaseSDK()
      viewController.setVenueId(venueId)
      viewController.modalPresentationStyle = .custom
      self.getRootViewController()?.present(viewController, animated: true)
    }
  }

  public func presentPrePurchaseAttraction(attractionId: String) {
    DispatchQueue.main.async {
      let viewController = PrePurchaseSDK()
      viewController.setAttractionId(attractionId)
      viewController.modalPresentationStyle = .custom
      self.getRootViewController()?.present(viewController, animated: true)
    }
  }

  public func presentPurchase(eventId: String) {
    DispatchQueue.main.async {
      let viewController = PurchaseSDK()
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
