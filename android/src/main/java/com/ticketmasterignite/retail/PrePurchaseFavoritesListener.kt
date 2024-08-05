package com.ticketmasterignite.retail

import com.ticketmaster.discoveryapi.models.DiscoveryAbstractEntity
import com.ticketmaster.discoveryapi.models.MemberInfo
import com.ticketmaster.prepurchase.listener.TMPrePurchaseFavoritesListener
import com.ticketmasterignite.GlobalEventEmitter

class PrePurchaseFavoritesListener: TMPrePurchaseFavoritesListener {
  override fun isAbstractEntityInFavorites(
    event: DiscoveryAbstractEntity,
    tmMemberInfo: MemberInfo?
  ): Boolean {
    TODO("Not yet implemented")
  }

  override fun onAbstractEntityAddedInFavorites(
    event: DiscoveryAbstractEntity,
    tmMemberInfo: MemberInfo?,
    didAdd: (Boolean) -> Unit
  ) {
    GlobalEventEmitter.sendEvent("onAbstractEntityAddedInFavorites", mapOf("event" to event, "memberInfo" to tmMemberInfo))
  }

  override fun onAbstractEntityRemovedFromFavorites(
    event: DiscoveryAbstractEntity,
    tmMemberInfo: MemberInfo?,
    didRemove: (Boolean) -> Unit
  ) {
    GlobalEventEmitter.sendEvent("onAbstractEntityAddedInFavorites", mapOf("event" to event, "memberInfo" to tmMemberInfo))
  }
}
