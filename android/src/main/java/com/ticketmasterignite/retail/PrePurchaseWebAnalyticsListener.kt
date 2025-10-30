package com.ticketmasterignite.retail

import com.ticketmaster.foundation.entity.UALPageView
import com.ticketmaster.foundation.entity.UALUserAction
import com.ticketmaster.prepurchase.listener.TMPrePurchaseWebAnalyticsListener
import java.net.URL

class PrePurchaseWebAnalyticsListener : TMPrePurchaseWebAnalyticsListener {
  override fun errorOnPageLoad(url: URL, error: Exception) {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "prePurchaseSdkPageLoadDidErrorFor")
  }

  override fun errorOnWebpage(url: URL, error: Exception) {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "prePurchaseSdkWebPageDidErrorFor")
  }

  override fun onWebpageReportedUALPageView(pageView: UALPageView) {
    return
  }

  override fun onWebpageReportedUALUserAction(action: UALUserAction) {
    return
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

}
