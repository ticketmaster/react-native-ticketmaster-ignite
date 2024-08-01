package com.ticketmasterignite.retail

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
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
    GlobalEventEmitter.sendEvent("onCheckoutFinished", "")
  }

  override fun onCheckoutStarted(event: DiscoveryEvent) {
    GlobalEventEmitter.sendEvent("onCheckoutStarted", "onCheckoutStarted")
    val params: WritableMap = Arguments.createMap()
    params.putString("accountsLoggedIn", "true")
    GlobalEventEmitter.sendEvent("igniteAnalytics", params)
  }

  override fun onManageMyTicketsOpened(event: DiscoveryEvent) {
    GlobalEventEmitter.sendEvent("onManageMyTicketsOpened", "onManageMyTicketsOpened")
  }

  override fun onMenuItemSelected(event: DiscoveryEvent, menuItemSelected: TMPurchaseMenuItem) {
    GlobalEventEmitter.sendEvent("onMenuItemSelected", "onMenuItemSelected")
  }

  override fun onSubPageOpened(event: DiscoveryEvent, subPage: TMPurchaseSubPage) {
    GlobalEventEmitter.sendEvent("onSubPageOpened", "onSubPageOpened")
  }

  override fun onTicketPurchased(event: DiscoveryEvent, order: TMPurchaseOrder) {
    GlobalEventEmitter.sendEvent("onTicketPurchased", "onTicketPurchased")
  }

  override fun onTicketSelectionFinished(
    event: DiscoveryEvent,
    reason: TMTicketSelectionEndReason
  ) {
    GlobalEventEmitter.sendEvent("onTicketSelectionFinished", "onTicketSelectionFinished")
  }

  override fun onTicketSelectionStarted(event: DiscoveryEvent) {
    GlobalEventEmitter.sendEvent("onTicketSelectionStarted", "onTicketSelectionStarted")
  }
}
