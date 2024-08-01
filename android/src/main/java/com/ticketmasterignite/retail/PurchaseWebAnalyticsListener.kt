package com.ticketmasterignite.retail

import com.ticketmaster.purchase.entity.UALCommerceEvent
import com.ticketmaster.purchase.entity.UALPageView
import com.ticketmaster.purchase.entity.UALUserAction
import com.ticketmaster.purchase.listener.TMPurchaseWebAnalyticsListener
import com.ticketmasterignite.GlobalEventEmitter
import java.net.URL

class PurchaseWebAnalyticsListener: TMPurchaseWebAnalyticsListener {
  override fun errorOnPageLoad(url: URL, error: Exception) {
    GlobalEventEmitter.sendEvent("errorOnPageLoad", "errorOnPageLoad")
  }

  override fun errorOnWebpage(url: URL, error: Exception) {
    GlobalEventEmitter.sendEvent("errorOnWebpage", "errorOnWebPag")
  }

  override fun onWebpageReportedUALCommerceEvent(commerceEvent: UALCommerceEvent) {
    GlobalEventEmitter.sendEvent("onWebpageReportedUALCommerceEvent", "")
  }

  override fun onWebpageReportedUALPageView(pageView: UALPageView) {
    GlobalEventEmitter.sendEvent("onWebpageReportedUALPageView", "")
  }

  override fun onWebpageReportedUALUserAction(action: UALUserAction) {
    GlobalEventEmitter.sendEvent("onWebpageReportedUALUserAction", "")
  }
}
