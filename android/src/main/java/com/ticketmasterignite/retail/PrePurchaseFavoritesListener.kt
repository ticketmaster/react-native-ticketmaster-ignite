package com.ticketmasterignite.retail

import com.ticketmaster.discoveryapi.models.DiscoveryAbstractEntity
import com.ticketmaster.discoveryapi.models.MemberInfo
import com.ticketmaster.prepurchase.listener.TMPrePurchaseFavoritesListener
import com.ticketmasterignite.GlobalEventEmitter

class PrePurchaseFavoritesListener : TMPrePurchaseFavoritesListener {
  // TODO("Commented out lines are not yet implemented")
  override fun isAbstractEntityInFavorites(event: DiscoveryAbstractEntity): Boolean {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "prePurchaseSdkIsEventInFavorites")
    return false
  }

  override fun onAbstractEntityAddedInFavorites(
    event: DiscoveryAbstractEntity,
    didAdd: (Boolean) -> Unit
  ) {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "prePurchaseSdkOnEventAddedInFavorites")
  }

  override fun onAbstractEntityRemovedFromFavorites(
    event: DiscoveryAbstractEntity,
    didRemove: (Boolean) -> Unit
  ) {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "prePurchaseSdkOnEventRemovedFromFavorites")
  }
}
