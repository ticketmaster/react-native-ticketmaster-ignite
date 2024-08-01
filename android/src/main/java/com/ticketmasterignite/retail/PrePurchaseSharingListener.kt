package com.ticketmasterignite.retail

import com.ticketmaster.discoveryapi.models.DiscoveryAbstractEntity
import com.ticketmaster.prepurchase.listener.TMPrePurchaseSharingListener
import com.ticketmasterignite.GlobalEventEmitter

class PrePurchaseSharingListener: TMPrePurchaseSharingListener {
  override fun getShareTextForArtistOrVenue(abstractEntity: DiscoveryAbstractEntity): String {
    GlobalEventEmitter.sendEvent("getShareTextForArtistOrVenue", "")
    return ""
  }
}
