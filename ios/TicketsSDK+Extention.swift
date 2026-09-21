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

private struct CustomModuleButtonConfig: Decodable {
  let title: String
  let dismissTicketViewIos: Bool
}

private struct CustomModuleConfig: Decodable {
  let headerType: String
  let headerColor: String
  let buttons: [CustomModuleButtonConfig]
}

// Mirrors the JSON written by IgniteProvider under the "customModules" config key
private func customModuleConfigs() -> [CustomModuleConfig] {
  guard let data = Config.shared.get(for: "customModules").data(using: .utf8),
        let configs = try? JSONDecoder().decode([CustomModuleConfig].self, from: data)
  else { return [] }
  return configs
}

private func customModuleIdentifier(moduleIndex: Int) -> String {
  return "com.\(Config.shared.get(for: "clientName")).\(moduleIndex)"
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
      case .eventModules:
        if case .eventTickets(let event, let tickets) = metadata {
          GlobalEventEmitter.sendEvent(
            name: eventName,
            body: [
              "ticketsSdkDidViewEventModules": [
                "eventId": event.info.identifier,
                "eventName": event.info.name,
                "ticketCount": tickets.count
              ]
            ]
          )
        }
      case .ticketDelivery:
        if case .eventTicket(let event, let ticket) = metadata {
          GlobalEventEmitter.sendEvent(
            name: eventName,
            body: [
              "ticketsSdkDidViewTicketDelivery": [
                "eventId": event.info.identifier,
                "eventName": event.info.name,
                "section": ticket.sectionName ?? "",
                "row": ticket.rowName ?? "",
                "seat": ticket.seatName ?? ""
              ]
            ]
          )
        }
      case .eventInfoBanner:
        if case .event(let event) = metadata {
          GlobalEventEmitter.sendEvent(
            name: eventName,
            body: [
              "ticketsSdkDidViewEventInfoBanner": [
                "eventId": event.info.identifier,
                "eventName": event.info.name
              ]
            ]
          )
        }
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
              "ticketsSdkDidInitiateAddTicketToWallet": [
                "eventId": event.info.identifier,
                "eventName": event.info.name,
                "section": ticket.sectionName ?? "",
                "row": ticket.rowName ?? "",
                "seat": ticket.seatName ?? ""
              ]
            ]
          )
        }
      case .transferSendButton:
        if case .eventTickets(let event, let tickets) = metadata {
          GlobalEventEmitter.sendEvent(
            name: eventName,
            body: [
              "ticketsSdkDidInitiateTransfer": [
                "eventId": event.info.identifier,
                "eventName": event.info.name,
                "ticketCount": tickets.count
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
      case .postingEditButton:
        if case .eventTickets(let event, let tickets) = metadata {
          GlobalEventEmitter.sendEvent(
            name: eventName,
            body: [
              "ticketsSdkDidEditResale": [
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
      case .eventInfoBannerButton:
        if case .event(let event) = metadata {
          GlobalEventEmitter.sendEvent(
            name: eventName,
            body: [
              "ticketsSdkDidPressEventInfoBanner": [
                "eventId": event.info.identifier,
                "eventName": event.info.name
              ]
            ]
          )
        }
      case .moduleActionButton:
        if case .moduleButton(let event, let module, let button) = metadata {
          GlobalEventEmitter.sendEvent(
            name: eventName,
            body: [
              "ticketsSdkDidPressModuleActionButton": [
                "eventId": event.info.identifier,
                "eventName": event.info.name,
                "moduleId": module.identifier,
                "buttonTitle": button.title,
                "buttonCallback": button.callbackValue
              ]
            ]
          )
        }
      case .navbarButtonAction:
        if case .event(let event) = metadata {
          GlobalEventEmitter.sendEvent(
            name: eventName,
            body: [
              "ticketsSdkDidPressNavbarButton": [
                "eventId": event.info.identifier,
                "eventName": event.info.name
              ]
            ]
          )
        }
      case .addTicketToWalletFinished:
        if case .eventTickets(let event, let tickets) = metadata {
          GlobalEventEmitter.sendEvent(
            name: eventName,
            body: [
              "ticketsSdkDidFinishAddTicketToWallet": [
                "eventId": event.info.identifier,
                "eventName": event.info.name,
                "ticketCount": tickets.count,
                "tickets": tickets.map { ticket in
                  [
                    "section": ticket.sectionName ?? "",
                    "row": ticket.rowName ?? "",
                    "seat": ticket.seatName ?? ""
                  ]
                }
              ]
            ]
          )
        } else {
          // Fallback when no metadata available
          GlobalEventEmitter.sendEvent(
            name: eventName,
            body: ["ticketsSdkDidFinishAddTicketToWallet": "ticketsSdkDidFinishAddTicketToWallet"]
          )
        }
      case .addTicketToWalletCanceled:
        GlobalEventEmitter.sendEvent(
          name: eventName,
          body: ["ticketsSdkDidCancelAddTicketToWallet": "ticketsSdkDidCancelAddTicketToWallet"]
        )
      @unknown default:
        return
      }
    }
  
  public func addCustomModules(event: TMPurchasedEvent, completion: @escaping ([TMTicketsModule]?) -> Void) {
    var modules: [TMTicketsModule] = customModuleConfigs().enumerated().map { (moduleIndex, config) in
      // callbackValue carries the button index so a press can be routed back to the matching JS callback
      let actionButtons = config.buttons.prefix(3).enumerated().map { (buttonIndex, button) in
        TMTicketsModule.ActionButton(title: button.title, callbackValue: "\(buttonIndex)")
      }
      return TMTicketsModule(
        identifier: customModuleIdentifier(moduleIndex: moduleIndex),
        headerDisplay: customModuleHeaderDisplay(config: config, moduleIndex: moduleIndex),
        actionButtons: actionButtons
      )
    }
    modules.append(contentsOf: addPreBuiltModules(event: event))
    completion(modules)
  }

  private func customModuleHeaderDisplay(config: CustomModuleConfig, moduleIndex: Int) -> TMTicketsModule.HeaderDisplay? {
    switch config.headerType {
    case "color":
      let hex = config.headerColor.trimmingCharacters(in: CharacterSet(charactersIn: "#"))
      guard let color = UIColor(hexString: hex) else { return nil }
      let view = FixedSizeHeaderView(
        frame: CGRect(origin: .zero, size: TMTicketsModule.HeaderDisplay.defaultSize)
      )
      view.backgroundColor = color
      return TMTicketsModule.HeaderDisplay(view: view)
    case "image":
      guard let image = Config.shared.getImage(for: "customModule\(moduleIndex)HeaderImage") else { return nil }
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
    let customModules = customModuleConfigs()
    if let moduleIndex = customModules.indices.first(where: { customModuleIdentifier(moduleIndex: $0) == module.identifier }),
       let buttonIndex = Int(button.callbackValue),
       customModules[moduleIndex].buttons.indices.contains(buttonIndex) {
      print("handleModuleActionButton: Custom Module \(module.identifier) Button \(buttonIndex)")
      if customModules[moduleIndex].buttons[buttonIndex].dismissTicketViewIos {
        completion(nil)
      }
      GlobalEventEmitter.sendEvent(
        name: eventName,
        body: [
          "ticketsSdkCustomModuleButtonPressed": [
            "moduleId": module.identifier,
            "moduleIndex": moduleIndex,
            "buttonIndex": buttonIndex,
            "buttonTitle": button.title,
            "eventOrderInfo": "\(event)"
          ]
        ]
      )
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
