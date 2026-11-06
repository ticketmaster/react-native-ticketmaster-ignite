import TicketmasterFoundation

class MarketDomainObject {
  static let shared = MarketDomainObject()

  func getMarketDomain() -> TicketmasterFoundation.MarketDomain {
    let marketDomain = Config.shared.get(for: "marketDomain")
    return MarketDomain(countryCode: marketDomain.lowercased()) ?? MarketDomain.US
  }
}
