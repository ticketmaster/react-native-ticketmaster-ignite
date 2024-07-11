import TicketmasterAuthentication
import TicketmasterTickets

public class TicketsSdkViewController: UIViewController {
  var ticketsView: TMTicketsView!
  
  
    public override func viewDidLoad() {
    super.viewDidLoad()
    
    let apiKey = Config.shared.get(for: "apiKey") 
    let tmxServiceSettings = TMAuthentication.TMXSettings(apiKey: apiKey,
                                                          region: .US)
    
    let branding = TMAuthentication.Branding(backgroundColor: .init(hexString: "#026cdf"),
                                             theme: .light)
    
    let brandedServiceSettings = TMAuthentication.BrandedServiceSettings(tmxSettings: tmxServiceSettings,
                                                                         branding: branding)
    
    // configure TMAuthentication with Settings and Branding
    print("Authentication SDK Configuring...")
    TMAuthentication.shared.configure(brandedServiceSettings: brandedServiceSettings) {
      backendsConfigured in
      
      // your API key may contain configurations for multiple backend services
      // the details are not needed for most common use-cases
      print(" - Authentication SDK Configured: \(backendsConfigured.count)")
      
      
      // TMTickets inherits it's configuration and branding from TMAuthentication
      print("Tickets SDK Configuring...")
      TMTickets.shared.configure {
        
        // Tickets is configured, now we are ready to present TMTicketsViewController or TMTicketsView
        print(" - Tickets SDK Configured")
        
        let ticketsVC = TMTicketsViewController()
        ticketsVC.modalPresentationStyle = .fullScreen
        self.present(ticketsVC, animated: false, completion: nil)
        
      } failure: { error in
        // something went wrong, probably TMAuthentication was not configured correctly
        print(" - Tickets SDK Configuration Error: \(error.localizedDescription)")
      }
      
    } failure: { error in
      // something went wrong, probably the wrong apiKey+region combination
      print(" - Authentication SDK Configuration Error: \(error.localizedDescription)")
    }
    
  }
  
    public override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)
    print("TicketsSdkViewController viewDidAppear")
  }
}


