import Foundation
import UIKit
import TicketmasterTickets

@objc public class TicketsSdkEmbeddedView: UIView, TicketsSdkViewProtocol, TMTicketsModuleDelegate, TMTicketsAnalyticsDelegate {
  
  private var ticketsView: TMTicketsView?
  
  public override init(frame: CGRect) {
    super.init(frame: frame)
    setupView()
  }
  
  required init?(coder: NSCoder) {
    super.init(coder: coder)
    setupView()
  }
  
  private func setupView() {
    TMTickets.shared.analyticsDelegate = self
    TMTickets.shared.moduleDelegate = self
    print("Tickets SDK Configuring...")
    
    TMTickets.shared.configure {
      print(" - Tickets SDK Configured")
      let ticketsView = TMTicketsView.init(frame: self.bounds)
      self.addSubview(ticketsView)
      self.ticketsView = ticketsView
      TMTickets.shared.start(ticketsView: ticketsView)
      if(!Config.shared.get(for: "orderIdDeepLink").isEmpty) {
        self.deepLinkToOrder(Config.shared.get(for: "orderIdDeepLink"))
      }
    } failure: { error in
      print(" - Tickets SDK Configuration Error: \(error.localizedDescription)")
    }
  }
  
  public override func layoutSubviews() {
    super.layoutSubviews()
    ticketsView?.frame = self.bounds
  }
}
