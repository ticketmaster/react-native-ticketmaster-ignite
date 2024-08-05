package com.ticketmasterignite.retail

import com.ticketmaster.discoveryapi.models.DiscoveryEvent
import com.ticketmaster.discoveryapi.models.MemberInfo
import com.ticketmaster.purchase.listener.TMPurchaseFavoritesListener
import com.ticketmasterignite.GlobalEventEmitter

class PurchaseFavoritesListener: TMPurchaseFavoritesListener {
  override fun isEventInFavorites(event: DiscoveryEvent, tmMemberInfo: MemberInfo?): Boolean {
    GlobalEventEmitter.sendEvent("isEventInFavorites", mapOf("event" to event, "memberInfo" to tmMemberInfo))
    return true
  }

  override fun onEventAddedInFavorites(
    event: DiscoveryEvent,
    tmMemberInfo: MemberInfo?,
    completion: (Boolean) -> Unit
  ) {
    GlobalEventEmitter.sendEvent("onEventAddedInFavorites", mapOf("event" to event, "memberInfo" to tmMemberInfo))
  }

  override fun onEventRemovedFromFavorites(
    event: DiscoveryEvent,
    tmMemberInfo: MemberInfo?,
    completion: (Boolean) -> Unit
  ) {
    GlobalEventEmitter.sendEvent("onEventRemovedFromFavorites", mapOf("event" to event, "memberInfo" to tmMemberInfo))
  }
}
