package com.ticketmasterignite

import com.ticketmaster.discoveryapi.enums.TMMarketDomain

object MarketDomain {

  fun getMarketDomain(marketDomain: String): TMMarketDomain {
    return when (marketDomain) {
      "AE" -> TMMarketDomain.AE
      "AT" -> TMMarketDomain.AT
      "AU" -> TMMarketDomain.AU
      "BE" -> TMMarketDomain.BE
      "CA" -> TMMarketDomain.CA
      "CH" -> TMMarketDomain.CH
      "CZ" -> TMMarketDomain.CZ
      "DE" -> TMMarketDomain.DE
      "DK" -> TMMarketDomain.DK
      "ES" -> TMMarketDomain.ES
      "FI" -> TMMarketDomain.FI
      "IE" -> TMMarketDomain.IE
      "MX" -> TMMarketDomain.MX
      "NL" -> TMMarketDomain.NL
      "NO" -> TMMarketDomain.NO
      "NZ" -> TMMarketDomain.NZ
      "PL" -> TMMarketDomain.PL
      "SE" -> TMMarketDomain.SE
      "UK" -> TMMarketDomain.UK
      "US" -> TMMarketDomain.US
      "ZA" -> TMMarketDomain.ZA
      else -> TMMarketDomain.US
    }
  }
}
