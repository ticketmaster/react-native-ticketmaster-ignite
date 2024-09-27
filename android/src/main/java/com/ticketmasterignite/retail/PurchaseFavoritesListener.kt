package com.ticketmasterignite.retail

import com.ticketmaster.discoveryapi.models.DiscoveryEvent
import com.ticketmaster.discoveryapi.models.MemberInfo
import com.ticketmaster.purchase.listener.TMPurchaseFavoritesListener
import com.ticketmasterignite.GlobalEventEmitter

class PurchaseFavoritesListener : TMPurchaseFavoritesListener {
  // TODO("Commented out lines are not yet implemented")
  override fun isEventInFavorites(event: DiscoveryEvent, tmMemberInfo: MemberInfo?): Boolean {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "purchaseSdkIsEventInFavorites")
    return true
  }

  override fun onEventAddedInFavorites(
    event: DiscoveryEvent,
    tmMemberInfo: MemberInfo?,
    completion: (Boolean) -> Unit
  ) {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "purchaseSdkOnEventAddedInFavorites")
  }

  override fun onEventRemovedFromFavorites(
    event: DiscoveryEvent,
    tmMemberInfo: MemberInfo?,
    completion: (Boolean) -> Unit
  ) {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "purchaseSdkOnEventRemovedFromFavorites")
  }
}
