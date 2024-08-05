package com.ticketmasterignite.retail

import com.ticketmaster.purchase.entity.UALCommerceEvent
import com.ticketmaster.purchase.entity.UALPageView
import com.ticketmaster.purchase.entity.UALUserAction
import com.ticketmaster.purchase.listener.TMPurchaseWebAnalyticsListener
import com.ticketmasterignite.GlobalEventEmitter
import java.net.URL

class PurchaseWebAnalyticsListener: TMPurchaseWebAnalyticsListener {
  override fun errorOnPageLoad(url: URL, error: Exception) {
    GlobalEventEmitter.sendEvent("errorOnPageLoad", mapOf("url" to url, "error" to error))
  }

  override fun errorOnWebpage(url: URL, error: Exception) {
    GlobalEventEmitter.sendEvent("errorOnWebpage", mapOf("url" to url, "error" to error))
  }

  override fun onWebpageReportedUALCommerceEvent(commerceEvent: UALCommerceEvent) {
    GlobalEventEmitter.sendEvent("onWebpageReportedUALCommerceEvent", commerceEvent)
  }

  override fun onWebpageReportedUALPageView(pageView: UALPageView) {
    GlobalEventEmitter.sendEvent("onWebpageReportedUALPageView", pageView)
  }

  override fun onWebpageReportedUALUserAction(action: UALUserAction) {
    GlobalEventEmitter.sendEvent("onWebpageReportedUALUserAction", action)
  }
}
