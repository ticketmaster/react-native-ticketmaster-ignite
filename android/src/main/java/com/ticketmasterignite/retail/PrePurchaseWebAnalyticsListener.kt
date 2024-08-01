package com.ticketmasterignite.retail

import com.ticketmaster.prepurchase.discovery.entity.UALPageView
import com.ticketmaster.prepurchase.discovery.entity.UALUserAction
import com.ticketmaster.prepurchase.listener.TMPrePurchaseWebAnalyticsListener
import com.ticketmasterignite.GlobalEventEmitter
import java.net.URL

class PrePurchaseWebAnalyticsListener: TMPrePurchaseWebAnalyticsListener {
  override fun errorOnPageLoad(url: URL, error: Exception) {
    GlobalEventEmitter.sendEvent("errorOnPageLoad", "")
  }

  override fun errorOnWebpage(url: URL, error: Exception) {
    GlobalEventEmitter.sendEvent("errorOnWebpage", "")
  }

  override fun onLoadingPage(url: URL) {
    GlobalEventEmitter.sendEvent("onLoadingPage", "")
  }

  override fun onPageLoadComplete(url: URL, duration: Long) {
    GlobalEventEmitter.sendEvent("onPageLoadComplete", "")
  }

  override fun onPageLoadProgressBarTimeout(url: URL, duration: Long) {
    GlobalEventEmitter.sendEvent("onPageLoadProgressBarTimeout", "")
  }

  override fun onWebpageReportedUALPageView(pageView: UALPageView) {
    GlobalEventEmitter.sendEvent("onWebpageReportedUALPageView", "")
  }

  override fun onWebpageReportedUALUserAction(action: UALUserAction) {
    GlobalEventEmitter.sendEvent("onWebpageReportedUALUserAction", "")
  }
}
