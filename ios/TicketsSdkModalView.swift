import Foundation
import UIKit
import TicketmasterTickets

@objc public class TicketsSdkModalView: UIView, TicketsSdkViewProtocol, TMTicketsModuleDelegate, TMTicketsAnalyticsDelegate {

  private var ticketsViewController: TMTicketsViewController?
  private weak var presentingViewController: UIViewController?
  private var isConfigured = false
  private var shouldPresentOnNextWindow = false

  // Used by React Native
  public override init(frame: CGRect) {
    super.init(frame: frame)
    setupView()
  }
  // Required in Swift UIView's, never called by RN
  required init?(coder: NSCoder) {
    super.init(coder: coder)
    setupView()
  }

  private func setupView() {
    TMTickets.shared.analyticsDelegate = self
    TMTickets.shared.moduleDelegate = self
    print("Tickets SDK Modal Configuring...")

    TMTickets.shared.configure {
      print(" - Tickets SDK Modal Configured")
      self.isConfigured = true
      self.presentModalIfNeeded()
      if(!Config.shared.get(for: "orderIdDeepLink").isEmpty) {
        self.deepLinkToOrder(Config.shared.get(for: "orderIdDeepLink"))
      }
    } failure: { error in
      print(" - Tickets SDK Modal Configuration Error: \(error.localizedDescription)")
    }
  }

  public override func didMoveToWindow() {
    super.didMoveToWindow()

    // When view is added to window hierarchy, present modal
    if window != nil {
      presentModalIfNeeded()
    }
  }

  private func presentModalIfNeeded() {
    guard let viewController = self.window?.rootViewController else {
      print("Unable to find root view controller to present modal")
      shouldPresentOnNextWindow = true
      return
    }

    let ticketsVC = TMTicketsViewController()
    ticketsVC.modalPresentationStyle = .fullScreen
    self.ticketsViewController = ticketsVC
    self.presentingViewController = viewController
    shouldPresentOnNextWindow = false

    print("Presenting Tickets SDK Modal")
    viewController.present(ticketsVC, animated: false, completion: nil)
  }

  deinit {
    print("TicketsSdkModalView deinit")
    GlobalEventEmitter.sendEvent(
      name: "igniteAnalytics", body: ["ticketsSdkDidViewEvents": "ticketsSdkDidViewEvents"])

    // Dismiss modal if still presented
    if let ticketsVC = ticketsViewController, ticketsVC.presentingViewController != nil {
      ticketsVC.dismiss(animated: false, completion: nil)
    }
  }
}
