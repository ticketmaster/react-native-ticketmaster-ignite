import TicketmasterFoundation

class MarketDomainObject {
  static let shared = MarketDomainObject()
  
  let marketDomain = Config.shared.get(for: "marketDomain")
  
  func getMarketDomain() -> TicketmasterFoundation.MarketDomain {
    return MarketDomain(countryCode: marketDomain.lowercased()) ?? MarketDomain.US
  }
}
