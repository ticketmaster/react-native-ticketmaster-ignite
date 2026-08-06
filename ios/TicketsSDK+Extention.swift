import Foundation
import UIKit
import TicketmasterTickets


protocol TicketsSDKViewProtocol {
  // Protocol doesn't need to define anything - just marks types that can use these delegates
}

private final class FixedSizeImageView: UIImageView {
  override var intrinsicContentSize: CGSize {
    return TMTicketsModule.HeaderDisplay.defaultSize
  }
}

private final class FixedSizeHeaderView: UIView {
  override var intrinsicContentSize: CGSize {
    return TMTicketsModule.HeaderDisplay.defaultSize
  }
}

extension TicketsSDKViewProtocol {
  func deepLinkToOrder(_ orderId: String) {
    TMTickets.shared.display(orderOrEventId: orderId)
    Config.shared.set(for: "orderIdDeepLink", value: "")
  }
}

extension TicketsSDKViewProtocol {

  public func userDidView(
    page: TMTickets.Analytics.Page,
    metadata: TMTickets.Analytics.MetadataType) {

      let eventName = "igniteAnalytics"

      print("userDidViewPage: \(page.rawValue)")

      switch page {
      case .events:
        GlobalEventEmitter.sendEvent(
          name: eventName, body: ["ticketsSdkDidViewEvents": "ticketsSdkDidViewEvents"])
      case .eventTickets:
        if case .eventTickets(let event, let tickets) = metadata {
          GlobalEventEmitter.sendEvent(
            name: eventName,
            body: [
              "ticketsSdkDidViewEventTickets": [
                "eventId": event.info.identifier,
                "eventName": event.info.name,
                "ticketCount": tickets.count
              ]
            ]
          )
        }
      case .ticketBarcode:
        if case .eventTicket(let event, let ticket) = metadata {
          GlobalEventEmitter.sendEvent(
            name: eventName,
            body: [
              "ticketsSdkDidViewTicketBarcode": [
                "eventId": event.info.identifier,
                "eventName": event.info.name,
                "section": ticket.sectionName ?? "",
                "row": ticket.rowName ?? "",
                "seat": ticket.seatName ?? ""
              ]
            ]
          )
        }
      case .ticketDetails:
        if case .eventTicket(let event, let ticket) = metadata {
          GlobalEventEmitter.sendEvent(
            name: eventName,
            body: [
              "ticketsSdkDidViewTicketDetails": [
                "eventId": event.info.identifier,
                "eventName": event.info.name,
                "section": ticket.sectionName ?? "",
                "row": ticket.rowName ?? "",
                "seat": ticket.seatName ?? ""
              ]
            ]
          )
        }
      case .mfaForTicketOperation:
        GlobalEventEmitter.sendEvent(
          name: eventName,
          body: ["ticketsSdkDidViewMfaForTicketOperation": "ticketsSdkDidViewMfaForTicketOperation"]
        )
      case .mfaForViewBarcode:
        GlobalEventEmitter.sendEvent(
          name: eventName,
          body: ["ticketsSdkDidViewMfaForViewBarcode": "ticketsSdkDidViewMfaForViewBarcode"]
        )
      case .mfaForWebpage:
        GlobalEventEmitter.sendEvent(
          name: eventName,
          body: ["ticketsSdkDidViewMfaForWebpage": "ticketsSdkDidViewMfaForWebpage"]
        )
      @unknown default:
        return
      }
    }

  public func userDidPerform(
    action: TMTickets.Analytics.Action,
    metadata: TMTickets.Analytics.MetadataType) {

      let eventName = "igniteAnalytics"

      print("userDidPerformAction: \(action.rawValue)")

      switch action {
      case .addTicketToWalletButton:
        if case .eventTicket(let event, let ticket) = metadata {
          GlobalEventEmitter.sendEvent(
            name: eventName,
            body: [
              "ticketsSdkDidAddTicketToWallet": [
                "eventId": event.info.identifier,
                "eventName": event.info.name,
                "section": ticket.sectionName ?? "",
                "row": ticket.rowName ?? "",
                "seat": ticket.seatName ?? ""
              ]
            ]
          )
        }
      case .transferCancelButton:
        if case .eventTickets(let event, let tickets) = metadata {
          GlobalEventEmitter.sendEvent(
            name: eventName,
            body: [
              "ticketsSdkDidCancelTransfer": [
                "eventId": event.info.identifier,
                "eventName": event.info.name,
                "ticketCount": tickets.count
              ]
            ]
          )
        }
      case .postingCancelButton:
        if case .eventTickets(let event, let tickets) = metadata {
          GlobalEventEmitter.sendEvent(
            name: eventName,
            body: [
              "ticketsSdkDidCancelResale": [
                "eventId": event.info.identifier,
                "eventName": event.info.name,
                "ticketCount": tickets.count
              ]
            ]
          )
        }
      case .barcodeScreenshot:
        if case .eventTicket(let event, let ticket) = metadata {
          GlobalEventEmitter.sendEvent(
            name: eventName,
            body: [
              "ticketsSdkDidTakeBarcodeScreenshot": [
                "eventId": event.info.identifier,
                "eventName": event.info.name,
                "section": ticket.sectionName ?? "",
                "row": ticket.rowName ?? "",
                "seat": ticket.seatName ?? ""
              ]
            ]
          )
        }
      case .pullToRefreshEvents:
        if case .events(let events) = metadata {
          GlobalEventEmitter.sendEvent(
            name: eventName,
            body: [
              "ticketsSdkDidPullToRefreshEvents": [
                "eventCount": events.count
              ]
            ]
          )
        }
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
      headerDisplay: customModuleHeaderDisplay(),
      actionButtons: actionButtons
    )
    
    var modules: [TMTicketsModule] = [module]
    modules.append(contentsOf: addPreBuiltModules(event: event))
    completion(modules)
  }
  
  private func customModuleHeaderDisplay() -> TMTicketsModule.HeaderDisplay? {
    let headerType = Config.shared.get(for: "customModuleHeaderType")

    switch headerType {
    case "color":
      let hex = Config.shared.get(for: "customModuleHeaderColor")
        .trimmingCharacters(in: CharacterSet(charactersIn: "#"))
      guard let color = UIColor(hexString: hex) else { return nil }
      let view = FixedSizeHeaderView(
        frame: CGRect(origin: .zero, size: TMTicketsModule.HeaderDisplay.defaultSize)
      )
      view.backgroundColor = color
      return TMTicketsModule.HeaderDisplay(view: view)
    case "image":
      guard let image = Config.shared.getImage(for: "customModuleHeaderImage") else { return nil }
      let imageView = FixedSizeImageView(image: image)
      imageView.contentMode = .scaleAspectFill
      imageView.clipsToBounds = true
      return TMTicketsModule.HeaderDisplay(view: imageView)
    default:
      return nil
    }
  }

  public func addPreBuiltModules(event: TMPurchasedEvent) -> [TMTicketsModule] {
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
    let eventName = "igniteAnalytics"
    print("\(module.identifier): \(button.callbackValue)")
    if (module.identifier == "com.\(Config.shared.get(for: "clientName"))") {
      if button.callbackValue == Config.shared.get(for: "button1Title") {
        print("handleModuleActionButton: Custom Module Button 1")
        if (Config.shared.get(for: "button1DismissTicketView") == "true") {
          completion(nil)
        }
        GlobalEventEmitter.sendEvent(
          name: eventName, body: ["ticketsSdkCustomModuleButton1": ["eventOrderInfo": "\(event)"]])
      }
      if button.callbackValue == Config.shared.get(for: "button2Title") {
        print("handleModuleActionButton: Custom Module Button 2")
        if (Config.shared.get(for: "button2DismissTicketView") == "true") {
          completion(nil)
        }
        GlobalEventEmitter.sendEvent(
          name: eventName, body: ["ticketsSdkCustomModuleButton2": ["eventOrderInfo": "\(event)"]])
      }
      if button.callbackValue == Config.shared.get(for: "button3Title") {
        print("handleModuleActionButton: Custom Module Button 3")
        if (Config.shared.get(for: "button3DismissTicketView") == "true") {
          completion(nil)
        }
        GlobalEventEmitter.sendEvent(
          name: eventName, body: ["ticketsSdkCustomModuleButton3": ["eventOrderInfo": "\(event)"]])
      }
    }
    if module.identifier == TMTicketsPrebuiltModule.ModuleName.venueConcessions.rawValue {
      if button.callbackValue == TMTicketsPrebuiltModule.ButtonCallbackName.order.rawValue {
        print("handleModuleActionButton: Present Venue Concessions: Order")
        if (Config.shared.get(for: "venueConcessionsModuleDismissTicketViewOrder") == "true") {
          completion(nil)
        }
        GlobalEventEmitter.sendEvent(
          name: eventName, body: ["ticketsSdkVenueConcessionsOrderFor": ["eventOrderInfo": "\(event)"]])
      } else if button.callbackValue == TMTicketsPrebuiltModule.ButtonCallbackName.wallet.rawValue {
        print("handleModuleActionButton: Present Venue Concessions: Wallet")
        if (Config.shared.get(for: "venueConcessionsModuleDismissTicketViewWallet") == "true") {
          completion(nil)
        }
        GlobalEventEmitter.sendEvent(
          name: eventName, body: ["ticketsSdkVenueConcessionsWalletFor": ["eventOrderInfo": "\(event)"]])
      }
    }
  }
}
