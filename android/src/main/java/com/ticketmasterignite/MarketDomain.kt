package com.ticketmasterignite

import com.ticketmaster.discoveryapi.enums.TMMarketDomain

object MarketDomain {

  fun getMarketDomain(marketDomain: String): TMMarketDomain {
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
