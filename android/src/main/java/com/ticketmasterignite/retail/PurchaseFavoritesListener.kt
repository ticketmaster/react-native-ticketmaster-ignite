package com.ticketmasterignite.retail

import com.ticketmaster.discoveryapi.models.DiscoveryEvent
import com.ticketmaster.discoveryapi.models.MemberInfo
import com.ticketmaster.purchase.listener.TMPurchaseFavoritesListener
import com.ticketmasterignite.GlobalEventEmitter

class PurchaseFavoritesListener: TMPurchaseFavoritesListener {
  override fun isEventInFavorites(event: DiscoveryEvent, tmMemberInfo: MemberInfo?): Boolean {
    GlobalEventEmitter.sendEvent("isEventInFavorites", "isEventInFavorites")
    return true
  }

  override fun onEventAddedInFavorites(
    event: DiscoveryEvent,
    tmMemberInfo: MemberInfo?,
    completion: (Boolean) -> Unit
  ) {
    GlobalEventEmitter.sendEvent("onEventAddedInFavorites", "onEventAddedInFavorites")
  }

  override fun onEventRemovedFromFavorites(
    event: DiscoveryEvent,
    tmMemberInfo: MemberInfo?,
    completion: (Boolean) -> Unit
  ) {
    GlobalEventEmitter.sendEvent("onEventRemovedFromFavorites", "onEventRemovedFromFavorites")
  }
}
