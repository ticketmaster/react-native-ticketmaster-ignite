package com.ticketmasterignite.retail

import com.ticketmaster.discoveryapi.models.DiscoveryAbstractEntity
import com.ticketmaster.discoveryapi.models.MemberInfo
import com.ticketmaster.prepurchase.listener.TMPrePurchaseFavoritesListener
import com.ticketmasterignite.GlobalEventEmitter

class PrePurchaseFavoritesListener: TMPrePurchaseFavoritesListener {
  override fun isAbstractEntityInFavorites(event: DiscoveryAbstractEntity): Boolean {
    TODO("Not yet implemented")
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "prePurchaseSdkIsEventInFavorites")
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
