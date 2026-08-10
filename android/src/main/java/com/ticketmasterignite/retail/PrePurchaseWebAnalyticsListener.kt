package com.ticketmasterignite.retail

import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.ticketmaster.foundation.entity.UALPageView
import com.ticketmaster.foundation.entity.UALUserAction
import com.ticketmaster.prepurchase.listener.TMPrePurchaseWebAnalyticsListener
import com.ticketmasterignite.GlobalEventEmitter
import java.net.URL

class PrePurchaseWebAnalyticsListener : TMPrePurchaseWebAnalyticsListener {

  override fun onWebpageReportedUALPageView(pageView: UALPageView) {
    val params: WritableMap = Arguments.createMap()
    val paramValues: WritableMap = Arguments.createMap().apply {
      putString("pageName", pageView.name)
      putString("pageUrl", pageView.payload["digitalData.page.pageInfo.destinationURL"] ?: "")
      putString("pageType", pageView.payload["digitalData.page.pageInfo.pageType"] ?: "")
    }
    params.putMap("prePurchaseSdkDidFirePageView", paramValues)
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
    params.putMap("prePurchaseSdkDidReportUalUserAction", paramValues)
    GlobalEventEmitter.sendEvent("igniteAnalytics", params)
  }

  override fun errorOnPageLoad(url: URL, error: Exception) {
    val params: WritableMap = Arguments.createMap()
    val paramValues: WritableMap = Arguments.createMap().apply {
      putString("url", url.toString())
      putString("error", error.message ?: "Unknown error")
    }
    params.putMap("prePurchaseSdkPageLoadDidErrorFor", paramValues)
    GlobalEventEmitter.sendEvent("igniteAnalytics", params)
  }

  override fun errorOnWebpage(url: URL, error: Exception) {
    val params: WritableMap = Arguments.createMap()
    val paramValues: WritableMap = Arguments.createMap().apply {
      putString("url", url.toString())
      putString("error", error.message ?: "Unknown error")
    }
    params.putMap("prePurchaseSdkWebPageDidErrorFor", paramValues)
    GlobalEventEmitter.sendEvent("igniteAnalytics", params)
  }

  override fun onLoadingPage(url: URL) {
    val params: WritableMap = Arguments.createMap()
    val paramValues: WritableMap = Arguments.createMap().apply {
      putString("url", url.toString())
    }
    params.putMap("prePurchaseSdkWebPageDidReportLoadingPage", paramValues)
    GlobalEventEmitter.sendEvent("igniteAnalytics", params)
  }

  override fun onPageLoadComplete(url: URL, duration: Long) {
    val params: WritableMap = Arguments.createMap()
    val paramValues: WritableMap = Arguments.createMap().apply {
      putString("url", url.toString())
      putDouble("duration", duration.toDouble())
    }
    params.putMap("prePurchaseSdkWebPageDidReportPageLoadComplete", paramValues)
    GlobalEventEmitter.sendEvent("igniteAnalytics", params)
  }

  override fun onPageLoadProgressBarTimeout(url: URL, duration: Long) {
    val params: WritableMap = Arguments.createMap()
    val paramValues: WritableMap = Arguments.createMap().apply {
      putString("url", url.toString())
      putDouble("duration", duration.toDouble())
    }
    params.putMap("prePurchaseSdkWebPageDidReportProgressBarTimeout", paramValues)
    GlobalEventEmitter.sendEvent("igniteAnalytics", params)
  }
}
