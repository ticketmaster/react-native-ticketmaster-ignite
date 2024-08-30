import TicketmasterAuthentication
import TicketmasterTickets

public class TicketsSdkViewController: UIViewController, TMTicketsAnalyticsDelegate {
    var ticketsView: TMTicketsView!
    
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        
        TMTickets.shared.analyticsDelegate = self
        print("Tickets SDK Configuring...")

        TMTickets.shared.configure {
            print(" - Tickets SDK Configured")
            let ticketsVC = TMTicketsViewController()
            ticketsVC.modalPresentationStyle = .fullScreen
            self.present(ticketsVC, animated: false, completion: nil)
        } failure: { error in
            print(" - Tickets SDK Configuration Error: \(error.localizedDescription)")
        }
    }
    
    public override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        print("TicketsSdkViewController viewDidAppear")
    }
    
    func sendEvent(_ name: String, body: [String : Any]) {
        EventEmitter.emitter.sendEvent(withName: name, body: body)
    }
    
    
    public func userDidView(
        page: TMTickets.Analytics.Page,
        metadata: TMTickets.Analytics.MetadataType) {
            
            print("userDidViewPage: \(page.rawValue)")
            
            // different Pages return different types of metadata
            switch metadata {
            case .events(let events):
                return
            case .event(let event):
                return
            case .eventTickets(let event, let tickets):
//                sendEvent("igniteAnalytics", body: ["ticketsSDKModalUserDidViewEventTickets:": "\(event) \(tickets)"])
                return
            case .eventTicket(event: let event, let ticket):
                let ticketSummary = "\(ticket.sectionName ?? "_") \(ticket.rowName ?? "_") \(ticket.seatName ?? "_")"
                return
            case .module(let event, let identifier):
                return
            case .moduleButton(let event, let module, let button):
                return
            case .empty:
                return
            @unknown default:
                return
            }
        }
    
    public func userDidPerform(
        action: TMTickets.Analytics.Action,
        metadata: TMTickets.Analytics.MetadataType) {
            
            print("userDidPerformAction: \(action.rawValue)")
            
            // different Actions return different types of metadata
            switch metadata {
            case .events(let events):
                return
            case .event(let event):
//                sendEvent("igniteAnalytics", body: ["ticketsSDKModalUserDidPerformEvent:": "\(event)"])
                return
                return
            case .eventTickets(let event, let tickets):
                return
            case .eventTicket(event: let event, let ticket):
                let ticketSummary = "\(ticket.sectionName ?? "_") \(ticket.rowName ?? "_") \(ticket.seatName ?? "_")"
                return
            case .module(let event, let identifier):
                return
            case .moduleButton(let event, let module, let button):
                return
            case .empty:
                return
            @unknown default:
                return
            }
        }
}


