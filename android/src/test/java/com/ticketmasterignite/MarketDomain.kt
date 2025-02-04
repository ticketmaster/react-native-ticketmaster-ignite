package com.ticketmasterignite

import org.junit.Test
import org.junit.Assert.*
import com.ticketmaster.discoveryapi.enums.TMMarketDomain

class MarketDomainTest{

  @Test
  fun `getMarketDomain with AU config`() {
    val result = MarketDomain.getMarketDomain("AU")
    assertEquals(TMMarketDomain.AU, result)
  }

  @Test
  fun `getMarketDomain with CA config`() {
    val result = MarketDomain.getMarketDomain("CA")
    assertEquals(TMMarketDomain.CA, result)
  }

  @Test
  fun `getMarketDomain with IE config`() {
    val result = MarketDomain.getMarketDomain("IE")
    assertEquals(TMMarketDomain.IE, result)
  }

  @Test
  fun `getMarketDomain with MX config`() {
    val result = MarketDomain.getMarketDomain("MX")
    assertEquals(TMMarketDomain.MX, result)
  }

  @Test
  fun `getMarketDomain with NZ config`() {
    val result = MarketDomain.getMarketDomain("NZ")
    assertEquals(TMMarketDomain.NZ, result)
  }

  @Test
  fun `getMarketDomain with UK config`() {
    val result = MarketDomain.getMarketDomain("UK")
    assertEquals(TMMarketDomain.UK, result)
  }

  @Test
  fun `getMarketDomain with US config`() {
    val result = MarketDomain.getMarketDomain("US")
    assertEquals(TMMarketDomain.US, result)
  }

  @Test
  fun `getMarketDomain with invalid input defaults to US`() {
    val result = MarketDomain.getMarketDomain("INVALID")
    assertEquals(TMMarketDomain.US, result)
  }

  @Test
  fun `getMarketDomain with empty string defaults to US`() {
    val result = MarketDomain.getMarketDomain("")
    assertEquals(TMMarketDomain.US, result)
  }

  @Test
  fun `getMarketDomain with null input defaults to US`() {
    val result = MarketDomain.getMarketDomain(null ?: "")
    assertEquals(TMMarketDomain.US, result)
  }
}
