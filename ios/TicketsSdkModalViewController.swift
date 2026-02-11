import Foundation
import UIKit
import TicketmasterTickets

class TicketsSdkModalViewController: UIViewController, TicketsSdkViewProtocol, TMTicketsModuleDelegate, TMTicketsAnalyticsDelegate {

  var firstRender: Bool = true

  override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
    if firstRender {
      firstRender = false
    } else {
      self.dismiss(animated: true)
    }
  }

  override func viewDidLoad() {
    super.viewDidLoad()

    TMTickets.shared.analyticsDelegate = self
    TMTickets.shared.moduleDelegate = self
    print("Tickets SDK Modal Configuring...")

    TMTickets.shared.configure {
      print(" - Tickets SDK Modal Configured")

      let ticketsVC = TMTicketsViewController()
      ticketsVC.modalPresentationStyle = .fullScreen
      self.present(ticketsVC, animated: false)

      if !Config.shared.get(for: "orderIdDeepLink").isEmpty {
        self.deepLinkToOrder(Config.shared.get(for: "orderIdDeepLink"))
      }
    } failure: { error in
      print(" - Tickets SDK Modal Configuration Error: \(error.localizedDescription)")
    }
  }

  override func viewDidDisappear(_ animated: Bool) {
    super.viewDidDisappear(animated)
    GlobalEventEmitter.sendEvent(
      name: "igniteAnalytics", body: ["ticketsSdkDidViewEvents": "ticketsSdkDidViewEvents"])
  }
}
