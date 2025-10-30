package com.ticketmasterignite.retail

import com.ticketmaster.foundation.entity.UALViewItem
import com.ticketmaster.purchase.entity.UALCommerceEvent
import com.ticketmaster.purchase.entity.UALPageView
import com.ticketmaster.purchase.entity.UALUserAction
import com.ticketmaster.purchase.listener.TMPurchaseWebAnalyticsListener
import com.ticketmasterignite.GlobalEventEmitter
import java.net.URL

class PurchaseWebAnalyticsListener : TMPurchaseWebAnalyticsListener {
  // TODO("Commented out lines are not yet implemented")
  override fun errorOnPageLoad(url: URL, error: Exception) {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "purchaseSdkPageLoadDidErrorFor")
  }

  override fun errorOnWebpage(url: URL, error: Exception) {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "purchaseSdkWebPageDidErrorFor")
  }

  override fun onWebpageReportedUALCommerceEvent(commerceEvent: UALCommerceEvent) {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "purchaseSdkWebPageDidReportUALCommerceEvent")
  }

  override fun onWebReportedViewItem(viewItem: UALViewItem) {
    TODO("Not yet implemented")
  }

  override fun onWebpageReportedUALPageView(pageView: UALPageView) {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "purchaseSdkWebPageDidReportUALPageView")
  }

  override fun onWebpageReportedUALUserAction(action: UALUserAction) {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "purchaseSdkWebPageDidReportUALUserAction")
  }
}
