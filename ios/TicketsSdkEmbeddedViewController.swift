import TicketmasterAuthentication
import TicketmasterTickets

public class TicketsSdkEmbeddedViewController: UIViewController, TMTicketsAnalyticsDelegate {
    var ticketsView: TMTicketsView!
    
    public override func viewDidLoad() {
        super.viewDidLoad()
        
        TMTickets.shared.analyticsDelegate = self
        print("Tickets SDK Configuring...")

        TMTickets.shared.configure {
            print(" - Tickets SDK Configured")
            self.ticketsView = TMTicketsView.init(frame: CGRect(x: 0, y: 0, width: UIScreen.main.bounds.width, height: self.view.frame.height))
            self.view.addSubview(self.ticketsView)
            TMTickets.shared.start(ticketsView: self.ticketsView)
        } failure: { error in
            print(" - Tickets SDK Configuration Error: \(error.localizedDescription)")
        }
    }
    
    public override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        print("TicketsSdkEmbeddedViewController viewDidAppear")
        
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
                print(" - event: \(event.info.identifier)")
            case .eventTickets(let event, let tickets):
                sendEvent("igniteAnalytics", body: ["ticketsSdkEmbeddedUserDidViewEventTickets:": "\(event) \(tickets)"])
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
                sendEvent("igniteAnalytics", body: ["ticketsSdkEmbeddedUserDidPerformEvent:": "\(event)"])
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
