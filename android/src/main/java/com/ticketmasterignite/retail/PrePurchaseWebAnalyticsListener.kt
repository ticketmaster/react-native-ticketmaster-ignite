package com.ticketmasterignite.retail

import com.ticketmaster.prepurchase.discovery.entity.UALPageView
import com.ticketmaster.prepurchase.discovery.entity.UALUserAction
import com.ticketmaster.prepurchase.listener.TMPrePurchaseWebAnalyticsListener
import com.ticketmasterignite.GlobalEventEmitter
import java.net.URL

class PrePurchaseWebAnalyticsListener : TMPrePurchaseWebAnalyticsListener {
  override fun errorOnPageLoad(url: URL, error: Exception) {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "prePurchaseSdkPageLoadDidErrorFor")
  }

  override fun errorOnWebpage(url: URL, error: Exception) {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "prePurchaseSdkWebPageDidErrorFor")
  }

  override fun onLoadingPage(url: URL) {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "prePurchaseSdkWebPageDidReportLoadingPage")
  }

  override fun onPageLoadComplete(url: URL, duration: Long) {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "prePurchaseSdkWebPageDidReportPageLoadComplete")
  }

  override fun onPageLoadProgressBarTimeout(url: URL, duration: Long) {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "prePurchaseSdkWebPageDidReportProgressBarTimeout")
  }

  override fun onWebpageReportedUALPageView(pageView: UALPageView) {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "prePurchaseSdkWebPageDidReportUALPageView")
  }

  override fun onWebpageReportedUALUserAction(action: UALUserAction) {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "prePurchaseSdkWebPageDidReportUALUserAction")
  }
}
