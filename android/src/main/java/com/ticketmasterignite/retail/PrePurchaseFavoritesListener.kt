package com.ticketmasterignite.retail

import com.ticketmaster.discoveryapi.models.DiscoveryAbstractEntity
import com.ticketmaster.discoveryapi.models.MemberInfo
import com.ticketmaster.prepurchase.listener.TMPrePurchaseFavoritesListener
import com.ticketmasterignite.GlobalEventEmitter

class PrePurchaseFavoritesListener: TMPrePurchaseFavoritesListener {
  override fun isAbstractEntityInFavorites(event: DiscoveryAbstractEntity): Boolean {
    TODO("Not yet implemented")
  }

  override fun onAbstractEntityAddedInFavorites(
    event: DiscoveryAbstractEntity,
    didAdd: (Boolean) -> Unit
  ) {
    GlobalEventEmitter.sendEvent("onAbstractEntityAddedInFavorites", "")
  }

  override fun onAbstractEntityRemovedFromFavorites(
    event: DiscoveryAbstractEntity,
    didRemove: (Boolean) -> Unit
  ) {
    GlobalEventEmitter.sendEvent("onAbstractEntityAddedInFavorites", "")
  }
}
