import Foundation
import UIKit

@objcMembers public class TicketsSdkModal: NSObject {

  public func showTicketsSdkModal() {
    DispatchQueue.main.async {
      let viewController = TicketsSdkModalViewController()
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
