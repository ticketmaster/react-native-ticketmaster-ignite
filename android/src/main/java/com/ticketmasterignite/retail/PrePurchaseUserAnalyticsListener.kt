package com.ticketmasterignite.retail

import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.ticketmaster.discoveryapi.models.DiscoveryAbstractEntity
import com.ticketmaster.discoveryapi.models.DiscoveryEvent
import com.ticketmaster.prepurchase.action.TMPageType
import com.ticketmaster.prepurchase.action.TMPrePurchaseMenuItem
import com.ticketmaster.prepurchase.listener.TMPrePurchaseUserAnalyticsListener
import com.ticketmaster.discoveryapi.models.category.Category
import com.ticketmasterignite.GlobalEventEmitter

class PrePurchaseUserAnalyticsListener : TMPrePurchaseUserAnalyticsListener {

  override fun onEDPSelectionStarted(event: DiscoveryEvent) {
    val params: WritableMap = Arguments.createMap()
    val paramValues: WritableMap = Arguments.createMap().apply {
      putString("eventId", event.discoveryID ?: "")
      putString("legacyId", event.hostID ?: "")
      putString("eventName", event.name ?: "")
    }
    params.putMap("prePurchaseSdkDidBeginTicketSelectionFor", paramValues)
    GlobalEventEmitter.sendEvent("igniteAnalytics", params)
  }

  override fun openURLNotSupported(url: String) {
    val params: WritableMap = Arguments.createMap()
    val paramValues: WritableMap = Arguments.createMap().apply {
      putString("url", url)
    }
    params.putMap("prePurchaseSdkDidEncounterUnsupportedUrl", paramValues)
    GlobalEventEmitter.sendEvent("igniteAnalytics", params)
  }

  override fun onMenuItemSelected(
    menuItem: TMPrePurchaseMenuItem,
    type: TMPageType,
    entity: DiscoveryAbstractEntity?,
    data: String?,
    category: Category?
  ) {
    if (menuItem == TMPrePurchaseMenuItem.ShareButton) {
      val params: WritableMap = Arguments.createMap()
      val paramValues: WritableMap = Arguments.createMap().apply {
        putString("pageTitle", entity?.name ?: "")
        putString("pageUrl", entity?.shareURL ?: "")
        putString("activityType", "")
      }
      params.putMap("prePurchaseSdkDidShare", paramValues)
      GlobalEventEmitter.sendEvent("igniteAnalytics", params)
    }
  }

  override fun onPageLoaded(
    type: TMPageType,
    data: String?,
    category: Category?
  ) {
    val params: WritableMap = Arguments.createMap()
    val paramValues: WritableMap = Arguments.createMap().apply {
      putString("pageType", type.toString())
      putString("data", data ?: "")
      category?.let {
        putString("categoryId", it.id ?: "")
        putString("categoryName", it.name ?: "")
        putString("categoryUrl", it.url ?: "")
        putString("cityName", it.cityName ?: "")
        putString("fullCityName", it.fullCityName)
      }
    }
    params.putMap("prePurchaseSdkDidLoadPage", paramValues)
    GlobalEventEmitter.sendEvent("igniteAnalytics", params)
  }
}
