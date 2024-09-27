package com.ticketmasterignite.retail

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.ticketmaster.discoveryapi.models.DiscoveryEvent
import com.ticketmaster.purchase.listener.TMPurchaseSharingListener
import com.ticketmasterignite.GlobalEventEmitter

class PurchaseSharingListener : TMPurchaseSharingListener {
  override fun getShareTextForEvent(event: DiscoveryEvent): String {
    val params: WritableMap = Arguments.createMap()
    val paramValues: WritableMap = Arguments.createMap().apply {
      putString("eventId", event.discoveryID)
      putString("legacyId", event.hostID)
      putString("eventName", event.name)
      putString("date", event.startDate)
      putString("timeZone", event.timeZone)
    }
    params.putMap("purchaseSdkDidShare", paramValues)

    GlobalEventEmitter.sendEvent("igniteAnalytics", params)

    return ""
  }
}
