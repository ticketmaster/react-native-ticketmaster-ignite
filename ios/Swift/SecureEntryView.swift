import TicketmasterSecureEntry
import UIKit

#if canImport(RNTicketmasterIgniteInterface)
import RNTicketmasterIgniteInterface
#endif

@objc public class SecureEntryWrapperView: UIView, TMIgniteSecureEntryView {

  private var secureEntryView: TicketmasterSecureEntry.SecureEntryView?

  public override init(frame: CGRect) {
    super.init(frame: frame)
    setupView()
  }

  required init?(coder: NSCoder) {
    super.init(coder: coder)
    setupView()
  }

  private func setupView() {
    let entryView = TicketmasterSecureEntry.SecureEntryView(frame: self.bounds)
    self.addSubview(entryView)
    self.secureEntryView = entryView
  }

  @objc public func setToken(_ token: String) {
    secureEntryView?.token = token
  }

  public override func layoutSubviews() {
    super.layoutSubviews()
    secureEntryView?.frame = self.bounds
  }
}

