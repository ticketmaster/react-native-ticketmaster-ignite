package com.ticketmasterignite.retail

import com.ticketmaster.discoveryapi.models.DiscoveryAbstractEntity
import com.ticketmaster.discoveryapi.models.DiscoveryEvent
import com.ticketmaster.prepurchase.action.TMPageType
import com.ticketmaster.prepurchase.action.TMPrePurchaseMenuItem
import com.ticketmaster.prepurchase.listener.TMPrePurchaseUserAnalyticsListener
import com.ticketmasterignite.GlobalEventEmitter

class PrePurchaseUserAnalyticsListener : TMPrePurchaseUserAnalyticsListener {
  // TODO("Commented out lines are not yet implemented")
  override fun onEDPSelectionStarted(event: DiscoveryEvent) {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "prePurchaseSdkDidBeginTicketSelectionFor")
  }

  override fun openURLNotSupported(url: String) {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "prePurchaseSdkDidEndCheckoutFor")
  }

  override fun onMenuItemSelected(
    menuItem: TMPrePurchaseMenuItem,
    type: TMPageType,
    entity: DiscoveryAbstractEntity?,
    data: String?
  ) {
    TODO("Not yet implemented")
  }

  override fun onPageLoaded(
    type: TMPageType,
    data: String?
  ) {
    return
  }
}
