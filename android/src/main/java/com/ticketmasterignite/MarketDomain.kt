package com.ticketmasterignite

import com.ticketmaster.discoveryapi.enums.TMMarketDomain

object MarketDomain {
  private var marketDomain = Config.get("marketDomain")

  fun getMarketDomain(): TMMarketDomain {
    return when (marketDomain) {
      "AU" -> TMMarketDomain.AU
      "CA" -> TMMarketDomain.CA
      "IE" -> TMMarketDomain.IE
      "MX" -> TMMarketDomain.MX
      "NZ" -> TMMarketDomain.NZ
      "UK" -> TMMarketDomain.UK
      "US" -> TMMarketDomain.US
      else -> TMMarketDomain.US
    }
  }
}
