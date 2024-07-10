import Foundation
import UIKit

class PrePurchaseView: UIView {
  var attractionId: String?
  var venueId: String?

  @objc(setAttractionIdProp:)
  public func setAttractionIdProp(_ attractionIdProp: NSString) {
    attractionId = attractionIdProp as String
  }
  
  @objc(setVenueIdProp:)
  public func setVenueIdProp(_ venueIdProp: NSString) {
    venueId = venueIdProp as String
  }
  
  public func getAttractionId() -> String? {
    return attractionId
  }
  
  public func getVenueId() -> String? {
    return venueId
  }
}
