import Foundation
import UIKit

#if canImport(RNTicketmasterIgniteInterface)
import RNTicketmasterIgniteInterface
#endif

@objcMembers public class TicketsSDKModal: NSObject, TMIgniteTicketsSDKModal {

  public func showTicketsSdkModal(_ deepLinkId: String?) {
    DispatchQueue.main.async {
      let viewController = TicketsSDKModalViewController()
      viewController.deepLinkId = deepLinkId
      viewController.modalPresentationStyle = .overFullScreen
      self.getRootViewController()?.present(viewController, animated: true)
    }
  }

  private func getRootViewController() -> UIViewController? {
    return UIApplication.shared.connectedScenes
      .compactMap { $0 as? UIWindowScene }
      .first?.keyWindow?.rootViewController
  }
}
