import TicketmasterTickets

// Extension to provide methods to UIViewController
extension UIViewController: TMTicketsModuleDelegate, TMTicketsAnalyticsDelegate {
  
  func sendEvent(_ name: String, body: [String : Any]) {
    GlobalEventEmitter.emitter.sendEvent(withName: name, body: body)
  }
  
  func deepLinkToOrder(_ orderId: String) {
    TMTickets.shared.display(orderOrEventId: orderId)
    Config.shared.set(for: "orderIdDeepLink", value: "")
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
        print(" - event: \(event.info.identifier)")
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
      
      switch metadata {
      case .events(let events):
        return
      case .event(let event):
        // sendEvent("igniteAnalytics", body: ["ticketsSdkDidPerformEvent:": "\(event)"])
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
  
  public func addCustomModules(event: TMPurchasedEvent, completion: @escaping ([TMTicketsModule]?) -> Void) {
    
    var actionButtons: [TMTicketsModule.ActionButton] = []
    
    if Config.shared.get(for: "button1") == "true" {
      actionButtons.append(
        TMTicketsModule.ActionButton(title: Config.shared.get(for: "button1Title"))
      )
    }
    
    if Config.shared.get(for: "button2") == "true" {
      actionButtons.append(
        TMTicketsModule.ActionButton(title: Config.shared.get(for: "button2Title"))
      )
    }
    
    if Config.shared.get(for: "button3") == "true" {
      actionButtons.append(
        TMTicketsModule.ActionButton(title: Config.shared.get(for: "button3Title"))
      )
    }
    
    let module = TMTicketsModule(
      identifier: "com.\(Config.shared.get(for: "clientName"))",
      headerDisplay: nil,
      actionButtons: actionButtons
    )
    
    var modules: [TMTicketsModule] = [module]
    
    modules.append(contentsOf: addPreBuiltModules(event: event))
    completion(modules)
  }
  
  func addPreBuiltModules(event: TMPurchasedEvent) -> [TMTicketsModule] {
    print(" - Adding Prebuilt Modules")
    var output: [TMTicketsModule] = []
    
    if let module = TMTicketsPrebuiltModule.accountManagerMoreTicketActions(event: event) {
      if(Config.shared.get(for: "moreTicketActionsModule") == "true") {
        output.append(module)
      }
    }
    
    if let module = TMTicketsPrebuiltModule.venueDirectionsViaAppleMaps(event: event) {
      if(Config.shared.get(for: "venueDirectionsModule") == "true") {
        output.append(module)
      }
    }
    
    let seatUpgradeOverride = TMTicketsPrebuiltModule.HeaderOverride(
      topLabelText: Config.shared.optionalString(for: "seatUpgradesModuleTopLabelText"),
      centerLabelText: Config.shared.optionalString(for: "seatUpgradesModuleCenterLabelText"),
      bottomLabelText: Config.shared.optionalString(for: "seatUpgradesModuleBottomLabelText"),
      gradientAlpha: 1.0,
      backgroundImage: Config.shared.getImage(for: "seatUpgradesModuleImage") ?? nil
    )
    
    if let module = TMTicketsPrebuiltModule.accountManagerSeatUpgrades(event: event, headerOverride: seatUpgradeOverride) {
      if(Config.shared.get(for: "seatUpgradesModule") == "true") {
        output.append(module)
      }
    }
    
    let venueConcessionsOverride = TMTicketsPrebuiltModule.HeaderOverride(
      topLabelText: Config.shared.optionalString(for: "venueConcessionsModuleTopLabelText"),
      centerLabelText: Config.shared.optionalString(for: "venueConcessionsModuleCenterLabelText"),
      bottomLabelText: Config.shared.optionalString(for: "venueConcessionsModuleBottomLabelText"),
      gradientAlpha: 1.0,
      backgroundImage: Config.shared.getImage(for: "venueConcessionsModuleImage") ?? nil
    )
    
    if let module = TMTicketsPrebuiltModule.venueConcessions(event: event, headerOverride: venueConcessionsOverride, showWalletButton: true) {
      if(Config.shared.get(for: "venueConcessionsModule") == "true") {
        output.append(module)
      }
    }
    
    if let module = TMTicketsPrebuiltModule.accountManagerInvoiceAction(event: event) {
      if(Config.shared.get(for: "invoiceModule") == "true") {
        output.append(module)
      }
    }
    
    return output
  }
  
  public func handleModuleActionButton(event: TMPurchasedEvent, module: TMTicketsModule, button: TMTicketsModule.ActionButton, completion: @escaping (TMTicketsModule.WebpageSettings?) -> Void) {
    print("\(module.identifier): \(button.callbackValue)")
    if (module.identifier == "com.\(Config.shared.get(for: "clientName"))") {
      if button.callbackValue == Config.shared.get(for: "button1Title") {
        print("handleModuleActionButton: Custom Module Button 1")
        if (Config.shared.get(for: "button1DismissTicketView") == "true") {
            completion(nil)
        }
        sendEvent("igniteAnalytics", body: ["ticketsSdkCustomModuleButton1": ["eventOrderInfo": "\(event)"]])
      }
      if button.callbackValue == Config.shared.get(for: "button2Title") {
        print("handleModuleActionButton: Custom Module Button 2")
        if (Config.shared.get(for: "button2DismissTicketView") == "true") {
            completion(nil)
        }
        sendEvent("igniteAnalytics", body: ["ticketsSdkCustomModuleButton2": ["eventOrderInfo": "\(event)"]])
      }
      if button.callbackValue == Config.shared.get(for: "button3Title") {
        print("handleModuleActionButton: Custom Module Button 3")
        if (Config.shared.get(for: "button3DismissTicketView") == "true") {
            completion(nil)
        }
        sendEvent("igniteAnalytics", body: ["ticketsSdkCustomModuleButton3": ["eventOrderInfo": "\(event)"]])
      }
    }
    if module.identifier == TMTicketsPrebuiltModule.ModuleName.venueConcessions.rawValue {
      if button.callbackValue == TMTicketsPrebuiltModule.ButtonCallbackName.order.rawValue {
        print("handleModuleActionButton: Present Venue Concessions: Order")
        if (Config.shared.get(for: "venueConcessionsModuleDismissTicketViewOrder") == "true") {
            completion(nil)
        }
        sendEvent("igniteAnalytics", body: ["ticketsSdkVenueConcessionsOrderFor": ["eventOrderInfo": "\(event)"]])
      } else if button.callbackValue == TMTicketsPrebuiltModule.ButtonCallbackName.wallet.rawValue {
        print("handleModuleActionButton: Present Venue Concessions: Wallet")
        if (Config.shared.get(for: "venueConcessionsModuleDismissTicketViewWallet") == "true") {
            completion(nil)
        }
        sendEvent("igniteAnalytics", body: ["ticketsSdkVenueConcessionsWalletFor": ["eventOrderInfo": "\(event)"]])
      }
    }
  }
}



