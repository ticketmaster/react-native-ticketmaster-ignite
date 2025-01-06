import TicketmasterTickets

@objc(TicketsSdkViewController)
public class TicketsSdkViewController: UIViewController{
  var ticketsView: TMTicketsView!
  
  public override func viewDidLoad() {
    super.viewDidLoad()
    TMTickets.shared.analyticsDelegate = self
    TMTickets.shared.moduleDelegate = self
    print("Tickets SDK Configuring...")
    
    TMTickets.shared.configure {
      print(" - Tickets SDK Configured")
      let ticketsVC = TMTicketsViewController()
      ticketsVC.modalPresentationStyle = .fullScreen
      self.present(ticketsVC, animated: false, completion: nil)
      if(!Config.shared.get(for: "orderIdDeepLink").isEmpty) {
        self.deepLinkToOrder(Config.shared.get(for: "orderIdDeepLink"))
      }
    } failure: { error in
      print(" - Tickets SDK Configuration Error: \(error.localizedDescription)")
    }
  }
  
  public override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)
    print("TicketsSdkViewController viewDidAppear")
  }
  
  deinit {
    sendEvent("igniteAnalytics", body: ["ticketsSdkDidViewEvents": "ticketsSdkDidViewEvents"])
  }
}


