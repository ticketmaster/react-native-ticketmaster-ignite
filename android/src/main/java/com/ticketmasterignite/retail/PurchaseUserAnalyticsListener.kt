package com.ticketmasterignite.retail

import com.ticketmaster.discoveryapi.models.DiscoveryEvent
import com.ticketmaster.purchase.action.TMCheckoutEndReason
import com.ticketmaster.purchase.action.TMPurchaseMenuItem
import com.ticketmaster.purchase.action.TMPurchaseSubPage
import com.ticketmaster.purchase.action.TMTicketSelectionEndReason
import com.ticketmaster.purchase.entity.TMPurchaseOrder
import com.ticketmaster.purchase.listener.TMPurchaseUserAnalyticsListener
import com.ticketmasterignite.GlobalEventEmitter

class PurchaseUserAnalyticsListener: TMPurchaseUserAnalyticsListener {
  override fun onCheckoutFinished(event: DiscoveryEvent, reason: TMCheckoutEndReason) {
    GlobalEventEmitter.sendEvent("onCheckoutFinished", mapOf("event" to event, "reason" to reason))
  }

  override fun onCheckoutStarted(event: DiscoveryEvent) {
    GlobalEventEmitter.sendEvent("onCheckoutStarted", mapOf("event" to event))
  }

  override fun onMenuItemSelected(event: DiscoveryEvent, menuItemSelected: TMPurchaseMenuItem) {
    GlobalEventEmitter.sendEvent("onMenuItemSelected", mapOf("event" to event, "menuItemSelected" to menuItemSelected))
  }

  override fun onSubPageOpened(event: DiscoveryEvent, subPage: TMPurchaseSubPage) {
    GlobalEventEmitter.sendEvent("onSubPageOpened", mapOf("event" to event, "subPage" to subPage))
  }

  override fun onTicketPurchased(event: DiscoveryEvent, order: TMPurchaseOrder) {
    GlobalEventEmitter.sendEvent("onTicketPurchased", mapOf("event" to event, "order" to order))
  }

  override fun onTicketSelectionFinished(
    event: DiscoveryEvent,
    reason: TMTicketSelectionEndReason
  ) {
    GlobalEventEmitter.sendEvent("onTicketPurchased", mapOf("event" to event, "reason" to reason))
  }

  override fun onTicketSelectionStarted(event: DiscoveryEvent) {
    GlobalEventEmitter.sendEvent("onTicketSelectionStarted", mapOf("event" to event))
  }
}
