import TicketmasterSecureEntry

@objc public class SecureEntryViewController: UIViewController {
  
  public override func viewDidLoad() {
    super.viewDidLoad()
    
    // Instantiate UIView to enable @objc(setToken:) to be called when RN UI component receives token prop
    self.view = SecureEntryUIView()
    
    // Pre-sync time, for Rotating Entry
    SecureEntryView.syncTime()
  }

  public override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)
    print("SecureEntryViewController viewDidAppear")
    
    let secureEntryView = SecureEntryView.init(frame: CGRect(x: 0, y: 0, width: self.view.frame.width, height: self.view.frame.height))
    secureEntryView.token = Config.shared.get(for: "secureEntryToken")
    self.view.addSubview(secureEntryView)
  }
}
