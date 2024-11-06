package com.ticketmasterignite.retail

import android.util.Log
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

class PurchaseUserAnalyticsListener(private val closeScreen: () -> Unit): TMPurchaseUserAnalyticsListener {

  override fun onTicketSelectionStarted(event: DiscoveryEvent) {
    val params: WritableMap = Arguments.createMap()
    val paramValues: WritableMap = Arguments.createMap().apply {
      putString("eventId", event.discoveryID)
      putString("legacyId", event.hostID)
      putString("eventName", event.name)
      putString("date", event.startDate)
      putString("timeZone", event.timeZone)
    }
    params.putMap("purchaseSdkDidBeginTicketSelectionFor", paramValues)

    GlobalEventEmitter.sendEvent("igniteAnalytics", params)
  }

  override fun onTicketSelectionFinished(
    event: DiscoveryEvent,
    reason: TMTicketSelectionEndReason
  ) {
    val params: WritableMap = Arguments.createMap()
    val paramValues: WritableMap = Arguments.createMap().apply {
      putString("eventId", event.discoveryID)
      putString("legacyId", event.hostID)
      putString("eventName", event.name)
      putString("date", event.startDate)
      putString("timeZone", event.timeZone)
      putString("reason", reason.name)
    }
    params.putMap("purchaseSdkDidEndTicketSelectionFor", paramValues)

    GlobalEventEmitter.sendEvent("igniteAnalytics", params)
  }

  override fun onCheckoutStarted(event: DiscoveryEvent) {
    val params: WritableMap = Arguments.createMap()
    val paramValues: WritableMap = Arguments.createMap().apply {
      putString("eventId", event.discoveryID)
      putString("legacyId", event.hostID)
      putString("eventName", event.name)
      putString("date", event.startDate)
      putString("timeZone", event.timeZone)
    }
    params.putMap("purchaseSdkDidBeginCheckoutFor", paramValues)

    GlobalEventEmitter.sendEvent("igniteAnalytics", params)
  }

  override fun onCheckoutFinished(event: DiscoveryEvent, reason: TMCheckoutEndReason) {
    val params: WritableMap = Arguments.createMap()
    val paramValues: WritableMap = Arguments.createMap().apply {
      putString("eventId", event.discoveryID)
      putString("legacyId", event.hostID)
      putString("eventName", event.name)
      putString("date", event.startDate)
      putString("timeZone", event.timeZone)
      putString("reason", reason.name)
    }
    params.putMap("purchaseSdkDidEndCheckoutFor", paramValues)

    GlobalEventEmitter.sendEvent("igniteAnalytics", params)
    closeScreen.invoke()
  }

  override fun onSubPageOpened(event: DiscoveryEvent, subPage: TMPurchaseSubPage) {
    val params: WritableMap = Arguments.createMap()
    val paramValues: WritableMap = Arguments.createMap().apply {
      putString("eventId", event.discoveryID)
      putString("legacyId", event.hostID)
      putString("eventName", event.name)
      putString("date", event.startDate)
      putString("timeZone", event.timeZone)
      putString("subPage", subPage.name)
    }
    params.putMap("purchaseSdkDidViewSubPageFor", paramValues)

    GlobalEventEmitter.sendEvent("igniteAnalytics", params)
  }

  override fun onMenuItemSelected(event: DiscoveryEvent, menuItemSelected: TMPurchaseMenuItem) {
    val params: WritableMap = Arguments.createMap()
    val paramValues: WritableMap = Arguments.createMap().apply {
      putString("eventId", event.discoveryID)
      putString("legacyId", event.hostID)
      putString("eventName", event.name)
      putString("date", event.startDate)
      putString("timeZone", event.timeZone)
      putString("button", menuItemSelected.name)
    }
    params.putMap("purchaseSdkDidPressNavBarButtonFor", paramValues)

    GlobalEventEmitter.sendEvent("igniteAnalytics", params)
  }

  override fun onTicketPurchased(event: DiscoveryEvent, order: TMPurchaseOrder) {
    val params: WritableMap = Arguments.createMap()
    val paramValues: WritableMap = Arguments.createMap().apply {
      putString("eventId", event.discoveryID)
      putString("legacyId", event.hostID)
      putString("eventName", event.name)
      putString("date", event.startDate)
      putString("timeZone", event.timeZone)
      putString("orderId", order.identifier)
      putString("orderName", order.eventName)
    }
    params.putMap("purchaseSdkDidMakePurchaseFor", paramValues)

    GlobalEventEmitter.sendEvent("igniteAnalytics", params)
  }

  override fun onManageMyTicketsOpened(event: DiscoveryEvent) {
    val params: WritableMap = Arguments.createMap().apply {
      putString("purchaseSdkManageMyTickets", "purchaseSdkManageMyTickets")
    }

    GlobalEventEmitter.sendEvent("igniteAnalytics", params)
    closeScreen.invoke()
  }
}
