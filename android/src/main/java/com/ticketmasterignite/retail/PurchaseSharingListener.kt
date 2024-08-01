package com.ticketmasterignite.retail

import com.ticketmaster.discoveryapi.models.DiscoveryEvent
import com.ticketmaster.purchase.listener.TMPurchaseSharingListener
import com.ticketmasterignite.GlobalEventEmitter

class PurchaseSharingListener: TMPurchaseSharingListener {
  override fun getShareTextForEvent(event: DiscoveryEvent): String {
    GlobalEventEmitter.sendEvent("getShareTextForEvent", "getShareTextForEvent")
    return ""
  }
}
