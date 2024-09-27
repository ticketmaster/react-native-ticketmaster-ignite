package com.ticketmasterignite.retail

import com.ticketmaster.discoveryapi.models.DiscoveryAbstractEntity
import com.ticketmaster.discoveryapi.models.DiscoveryEvent
import com.ticketmaster.prepurchase.action.TMPrePurchaseMenuItem
import com.ticketmaster.prepurchase.listener.TMPrePurchaseUserAnalyticsListener
import com.ticketmasterignite.GlobalEventEmitter

class PrePurchaseUserAnalyticsListener : TMPrePurchaseUserAnalyticsListener {
  // TODO("Commented out lines are not yet implemented")
  override fun onEDPSelectionStarted(event: DiscoveryEvent) {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "prePurchaseSdkDidBeginTicketSelectionFor")
  }

  override fun onMenuItemSelected(
    event: DiscoveryAbstractEntity,
    menuItemSelected: TMPrePurchaseMenuItem
  ) {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "prePurchaseSdkDidPressNavBarButtonFor")
  }

  override fun openURLNotSupported(url: String) {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "prePurchaseSdkDidEndCheckoutFor")
  }
}
