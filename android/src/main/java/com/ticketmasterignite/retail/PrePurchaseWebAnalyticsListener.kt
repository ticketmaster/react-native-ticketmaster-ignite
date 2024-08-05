package com.ticketmasterignite.retail

import com.ticketmaster.prepurchase.discovery.entity.UALPageView
import com.ticketmaster.prepurchase.discovery.entity.UALUserAction
import com.ticketmaster.prepurchase.listener.TMPrePurchaseWebAnalyticsListener
import com.ticketmasterignite.GlobalEventEmitter
import java.net.URL

class PrePurchaseWebAnalyticsListener: TMPrePurchaseWebAnalyticsListener {
  override fun errorOnPageLoad(url: URL, error: Exception) {
    GlobalEventEmitter.sendEvent("errorOnPageLoad", mapOf("url" to url, "errorMessage" to error.message))
  }

  override fun errorOnWebpage(url: URL, error: Exception) {
    GlobalEventEmitter.sendEvent("errorOnWebpage", mapOf("url" to url, "errorMessage" to error.message))
  }

  override fun onLoadingPage(url: URL) {
    GlobalEventEmitter.sendEvent("onLoadingPage", mapOf("url" to url))
  }

  override fun onPageLoadComplete(url: URL, duration: Long) {
    GlobalEventEmitter.sendEvent("onPageLoadComplete", mapOf("url" to url, "duration" to duration))
  }

  override fun onPageLoadProgressBarTimeout(url: URL, duration: Long) {
    GlobalEventEmitter.sendEvent("onPageLoadProgressBarTimeout", mapOf("url" to url, "duration" to duration))
  }

  override fun onWebpageReportedUALPageView(pageView: UALPageView) {
    GlobalEventEmitter.sendEvent("onWebpageReportedUALPageView", pageView)
  }

  override fun onWebpageReportedUALUserAction(action: UALUserAction) {
    GlobalEventEmitter.sendEvent("onWebpageReportedUALUserAction", action)
  }
}
