import TicketmasterFoundation

class MarketDomainObject {
  static let shared = MarketDomainObject()
    
  func getMarketDomain(marketDomainConfig: String) -> TicketmasterFoundation.MarketDomain {
    return MarketDomain(countryCode: marketDomainConfig.lowercased()) ?? MarketDomain.US
  }
}
