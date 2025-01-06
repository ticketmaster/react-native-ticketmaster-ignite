import Foundation
import TicketmasterTickets

@objc(TicketsSdkEmbeddedViewController)
public class TicketsSdkEmbeddedViewController: UIViewController {
  
  public override func viewDidLoad() {
    super.viewDidLoad()
    TMTickets.shared.analyticsDelegate = self
    TMTickets.shared.moduleDelegate = self
    print("Tickets SDK Configuring...")
    
    TMTickets.shared.configure {
      print(" - Tickets SDK Configured")
      let ticketsView = TMTicketsView.init(frame: CGRect(x: 0, y: 0, width: UIScreen.main.bounds.width, height: self.view.frame.height))
      self.view.addSubview(ticketsView)
      TMTickets.shared.start(ticketsView: ticketsView)
      if(!Config.shared.get(for: "orderIdDeepLink").isEmpty) {
        self.deepLinkToOrder(Config.shared.get(for: "orderIdDeepLink"))
      }
    } failure: { error in
      print(" - Tickets SDK Configuration Error: \(error.localizedDescription)")
    }
  }
  
  public override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)
    print("TicketsSdkEmbeddedViewController viewDidAppear")
  }
}
