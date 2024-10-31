import Foundation
import TicketmasterTickets

public class TicketsSdkViewController: UIViewController, TMTicketsAnalyticsDelegate, TMTicketsModuleDelegate {
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
  
  func sendEvent(_ name: String, body: [String : Any]) {
    EventEmitter.emitter.sendEvent(withName: name, body: body)
  }
  
  public func addCustomModules(event: TicketmasterTickets.TMPurchasedEvent, completion: @escaping ([TicketmasterTickets.TMTicketsModule]?) -> Void) {
    var modules: [TMTicketsModule] = []
    
    modules.append(contentsOf: addPreBuiltModules(event: event))
    completion(modules)
  }
  
  func addPreBuiltModules(event: TMPurchasedEvent) -> [TMTicketsModule] {
    print(" - Adding Prebuilt Modules")
    var output: [TMTicketsModule] = []
    
    // show an Account Manager More Ticket Actions module
    // note that this module will only render if Event is an Account Manager Event, otherwise it will not be displayed
    // this is a standard "prebuilt" module that we provide to all our partners
    if let module = TMTicketsPrebuiltModule.accountManagerMoreTicketActions(event: event) {
      if(Config.shared.get(for: "moreTicketsActionsModule") == "true") {
        output.append(module)
      }
    }
    
    
    // show a street-map around the Venue with a Directions button that opens Apple Maps
    // this is a standard "prebuilt" module that we provide to all our partners
    if let module = TMTicketsPrebuiltModule.venueDirectionsViaAppleMaps(event: event) {
      if(Config.shared.get(for: "venueDirectionsModule") == "true") {
        output.append(module)
      }
    }
    
    // show an Account Manager Seat Upgrades module
    // note that this module will only render if Event is an Account Manager Event, otherwise it will not be displayed
    // this is a standard "prebuilt" module that we provide to all our partners
    if let module = TMTicketsPrebuiltModule.accountManagerSeatUpgrades(event: event) {
      if(Config.shared.get(for: "seatUpgradesModule") == "true") {
        output.append(module)
      }
    }
    
    // show a Venue Concessions module
    // this is a standard "prebuilt" module that we provide to all our partners
    if let module = TMTicketsPrebuiltModule.venueConcessions(event: event, showWalletButton: true) {
      if(Config.shared.get(for: "venueConcessionsModule") == "true") {
        output.append(module)
      }
    }
    
    // show an Account Manager Invoice Actions module
    // note that this module will only render if Event is an Account Manager Event, otherwise it will not be displayed
    // this is a standard "prebuilt" module that we provide to all our partners
    if let module = TMTicketsPrebuiltModule.accountManagerInvoiceAction(event: event) {
      if(Config.shared.get(for: "invoiceModule") == "true") {
        output.append(module)
      }
    }
    
    return output
  }
  
  public func handleModuleActionButton(event: TMPurchasedEvent, module: TMTicketsModule, button: TMTicketsModule.ActionButton, completion: @escaping (TMTicketsModule.WebpageSettings?) -> Void) {
    // Tickets SDK won't call this method unless it is not sure what to do with the given module
    // to get analytics about all modules, see userDidPerform(action:metadata:)
    print("\(module.identifier): \(button.callbackValue)")
    if module.identifier == TMTicketsPrebuiltModule.ModuleName.venueConcessions.rawValue {
      if button.callbackValue == TMTicketsPrebuiltModule.ButtonCallbackName.order.rawValue {
        completion(nil) // dismiss My Tickets view in Tickets SDK
        sendEvent("igniteAnalytics", body: ["ticketsSdkVenueConcessionsOrderFor": ["eventOrderInfo": "\(event)"]])
        print("handleModuleActionButton: Present Venue Concessions: Order")
      } else if button.callbackValue == TMTicketsPrebuiltModule.ButtonCallbackName.wallet.rawValue {
        print("handleModuleActionButton: Present Venue Concessions: Wallet")
        completion(nil) // dismiss My Tickets view in Tickets SDK
        sendEvent("igniteAnalytics", body: ["ticketsSdkVenueConcessionsWalletFor": ["eventOrderInfo": "\(event)"]])
      }
    }
  }
  
  public func userDidView(
    page: TMTickets.Analytics.Page,
    metadata: TMTickets.Analytics.MetadataType) {
      
      print("userDidViewPage: \(page.rawValue)")
      // The below lets React Native know it needs to update its isLoggedIn value
      sendEvent("igniteAnalytics", body: ["ticketsSdkDidViewEvents": "ticketsSdkDidViewEvents"])
      
      // different Pages return different types of metadata
      switch metadata {
      case .events(let events):
        return
      case .event(let event):
        return
      case .eventTickets(let event, let tickets):
      // sendEvent("igniteAnalytics", body: ["ticketsSdkDidViewEventTickets:": "\(event) \(tickets)"])
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
        // sendEvent("igniteAnalytics", body: ["ticketsSdkDidPerformEvent:": "\(event)"])
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


