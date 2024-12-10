//
//  SampleTest.swift
//  TicketmasterIgniteExampleTests
//
//  Created by justyna zygmunt on 06/12/2024.
//
import XCTest
import TicketmasterFoundation
@testable import react_native_ticketmaster_ignite

class MarketDomainObjectTests: XCTestCase {
  let marketDomainObject = MarketDomainObject()

  func testGetMarketDomainReturnsCorrectDomainForUs() {
    let domain = marketDomainObject.getMarketDomain(marketDomainConfig: "US")

    XCTAssertEqual(domain, MarketDomain.US, "getMarketDomain should return the correct domain for 'us'.")
  }
  
  func testGetMarketDomainReturnsCorrectDomainForAU() {
    let domain = marketDomainObject.getMarketDomain(marketDomainConfig: "AU")
    
    XCTAssertEqual(domain, MarketDomain.AU, "getMarketDomain should return the correct domain for 'AU'.")
  }
  
  func testGetMarketDomainReturnsCorrectDomainWhenEmptyStringPassed() {
    let domain = marketDomainObject.getMarketDomain(marketDomainConfig: "")
    
    XCTAssertEqual(domain, MarketDomain.US, "getMarketDomain should return US domain for empty strings.")
  }
}
