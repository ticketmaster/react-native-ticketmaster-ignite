package com.ticketmasterignite.retail

import com.ticketmaster.discoveryapi.models.DiscoveryAbstractEntity
import com.ticketmaster.discoveryapi.models.DiscoveryEvent
import com.ticketmaster.prepurchase.action.TMPrePurchaseMenuItem
import com.ticketmaster.prepurchase.listener.TMPrePurchaseUserAnalyticsListener
import com.ticketmasterignite.GlobalEventEmitter

class PrePurchaseUserAnalyticsListener: TMPrePurchaseUserAnalyticsListener {
  override fun onEDPSelectionStarted(event: DiscoveryEvent) {
    GlobalEventEmitter.sendEvent("onEDPSelectionStarted", mapOf("event" to event))
  }

  override fun onMenuItemSelected(
    event: DiscoveryAbstractEntity,
    menuItemSelected: TMPrePurchaseMenuItem
  ) {
    GlobalEventEmitter.sendEvent("onMenuItemSelected", mapOf("event" to event, "menuItemSelected" to menuItemSelected))
  }

  override fun openURLNotSupported(url: String) {
    GlobalEventEmitter.sendEvent("openURLNotSupported", url)
  }
}
