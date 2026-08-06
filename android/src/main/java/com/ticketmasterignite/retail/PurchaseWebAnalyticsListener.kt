package com.ticketmasterignite.retail

import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.ticketmaster.foundation.entity.UALViewItem
import com.ticketmaster.purchase.entity.UALCommerceEvent
import com.ticketmaster.purchase.entity.UALPageView
import com.ticketmaster.purchase.entity.UALUserAction
import com.ticketmaster.purchase.listener.TMPurchaseWebAnalyticsListener
import com.ticketmasterignite.GlobalEventEmitter
import java.net.URL

class PurchaseWebAnalyticsListener : TMPurchaseWebAnalyticsListener {

  override fun errorOnPageLoad(url: URL, error: Exception) {
    val params: WritableMap = Arguments.createMap()
    val paramValues: WritableMap = Arguments.createMap().apply {
      putString("url", url.toString())
      putString("error", error.message ?: "Unknown error")
    }
    params.putMap("purchaseSdkDidErrorOnPageLoad", paramValues)
    GlobalEventEmitter.sendEvent("igniteAnalytics", params)
  }

  override fun errorOnWebpage(url: URL, error: Exception) {
    val params: WritableMap = Arguments.createMap()
    val paramValues: WritableMap = Arguments.createMap().apply {
      putString("url", url.toString())
      putString("error", error.message ?: "Unknown error")
    }
    params.putMap("purchaseSdkDidErrorOnWebpage", paramValues)
    GlobalEventEmitter.sendEvent("igniteAnalytics", params)
  }

  override fun onWebpageReportedUALCommerceEvent(commerceEvent: UALCommerceEvent) {
    val params: WritableMap = Arguments.createMap()
    val paramValues: WritableMap = Arguments.createMap().apply {
      putString("eventType", commerceEvent.eventType.toString())
      putString("eventName", "")
      putString("transactionId", "")
      putString("transactionTotal", "")
    }
    params.putMap("purchaseSdkDidReportUalCommerceEvent", paramValues)
    GlobalEventEmitter.sendEvent("igniteAnalytics", params)
  }

  override fun onWebReportedViewItem(viewItem: UALViewItem) {
    val params: WritableMap = Arguments.createMap()
    val paramValues: WritableMap = Arguments.createMap().apply {
      putString("itemId", viewItem.payload["id"] ?: "")
      putString("itemName", viewItem.name)
      putString("itemCategory", viewItem.payload["category"] ?: "")
      putString("itemVariant", viewItem.payload["variant"] ?: "")
    }
    params.putMap("purchaseSdkDidReportUalViewItem", paramValues)
    GlobalEventEmitter.sendEvent("igniteAnalytics", params)
  }

  override fun onWebpageReportedUALPageView(pageView: UALPageView) {
    val params: WritableMap = Arguments.createMap()
    val paramValues: WritableMap = Arguments.createMap().apply {
      putString("pageName", pageView.name)
      putString("pageUrl", pageView.payload["url"] ?: "")
      putString("pageReferrer", pageView.payload["referrer"] ?: "")
      putString("pageType", pageView.payload["type"] ?: "")
    }
    params.putMap("purchaseSdkDidReportUalPageView", paramValues)
    GlobalEventEmitter.sendEvent("igniteAnalytics", params)
  }

  override fun onWebpageReportedUALUserAction(action: UALUserAction) {
    val params: WritableMap = Arguments.createMap()
    val paramValues: WritableMap = Arguments.createMap().apply {
      putString("actionType", action.category)
      putString("actionLabel", action.label)
      putString("actionValue", action.value)
      putString("actionName", action.name)
      putString("actionCategory", action.category)
    }
    params.putMap("purchaseSdkDidReportUalUserAction", paramValues)
    GlobalEventEmitter.sendEvent("igniteAnalytics", params)
  }
}
