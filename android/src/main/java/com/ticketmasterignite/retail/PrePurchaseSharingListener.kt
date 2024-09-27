package com.ticketmasterignite.retail

import com.ticketmaster.discoveryapi.models.DiscoveryAbstractEntity
import com.ticketmaster.prepurchase.listener.TMPrePurchaseSharingListener
import com.ticketmasterignite.GlobalEventEmitter

class PrePurchaseSharingListener : TMPrePurchaseSharingListener {
  // TODO("Commented out lines are not yet implemented")
  override fun getShareTextForArtistOrVenue(abstractEntity: DiscoveryAbstractEntity): String {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "prePurchaseSdkDidShare")
    return ""
  }
}
