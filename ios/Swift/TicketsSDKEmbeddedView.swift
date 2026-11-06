import Foundation
import UIKit
import TicketmasterTickets

@objc public class TicketsSDKEmbeddedView: UIView, TicketsSDKViewProtocol, TMTicketsModuleDelegate, TMTicketsAnalyticsDelegate {

  private var ticketsView: TMTicketsView?
  private var currentDeepLinkId: String?
  private var previousDeepLinkId: String?

  // Called by React Native Fabric when creating the view programmatically
  public override init(frame: CGRect) {
    super.init(frame: frame)
    setupView()
    NotificationCenter.default.addObserver(
      self,
      selector: #selector(refreshConfiguration),
      name: NSNotification.Name("ConfigurationRefreshed"),
      object: nil
    )
  }

  // Required by Swift/UIKit but never called by React Native, only used used when loading views from Storyboard/XIB files
  required init?(coder: NSCoder) {
    super.init(coder: coder)
    setupView()
  }

  deinit {
    NotificationCenter.default.removeObserver(self)
  }

  @objc private func refreshConfiguration() {
    if let existingView = ticketsView {
      existingView.removeFromSuperview()
      ticketsView = nil
    }

    TMTickets.shared.analyticsDelegate = nil
    TMTickets.shared.moduleDelegate = nil

    setupView()
  }
  
  private func setupView() {
    TMTickets.shared.analyticsDelegate = self
    TMTickets.shared.moduleDelegate = self

    print("Tickets SDK Configuring...")

    TMTickets.shared.configure {
      DispatchQueue.main.async {
        let ticketsView = TMTicketsView.init(frame: self.bounds)
        self.addSubview(ticketsView)
        self.ticketsView = ticketsView
        TMTickets.shared.start(ticketsView: ticketsView)

        if let deepLinkId = self.currentDeepLinkId, !deepLinkId.isEmpty {
          self.deepLinkToOrder(deepLinkId)
        }
      }
    } failure: { error in
      print(" - Tickets SDK Configuration Error: \(error.localizedDescription)")
    }
  }

  @objc public func setDeepLinkId(_ deepLinkId: String?) {
    let hasChanged = deepLinkId != previousDeepLinkId

    if hasChanged && deepLinkId != nil && !deepLinkId!.isEmpty {
      currentDeepLinkId = deepLinkId
      previousDeepLinkId = deepLinkId
      refreshConfiguration()
    } else if deepLinkId == nil || deepLinkId!.isEmpty {
      // Set to cleared value
      currentDeepLinkId = deepLinkId
      previousDeepLinkId = deepLinkId
    }
  }
  
  public override func layoutSubviews() {
    super.layoutSubviews()
    ticketsView?.frame = self.bounds
  }
}
