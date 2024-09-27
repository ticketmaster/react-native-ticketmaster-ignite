package com.ticketmasterignite.retail

import com.ticketmaster.discoveryapi.enums.TMMarketDomain
import com.ticketmaster.prepurchase.listener.TMPrePurchaseCountrySelectorListener
import com.ticketmasterignite.GlobalEventEmitter

class PrePurchaseCountryPickerListener : TMPrePurchaseCountrySelectorListener {
  override fun onCountryPickerClosed() {
//    GlobalEventEmitter.sendEvent("igniteAnalytics onCountryPickerClosed", "prePurchaseSdkOnCountryPickerClosed")
  }

  override fun onCountryPickerDialogDismissed() {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "prePurchaseSdkOnCountryPickerDialogDismissed")
  }

  override fun onCountryPickerOpened() {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "prePurchaseSdkOnCountryPickerOpened")
  }

  override fun onMarketChange(globalMarketDomain: TMMarketDomain) {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "prePurchaseSdkOnMarketChange")
  }

  override fun updateCountryMarket(market: (TMMarketDomain) -> Unit) {
//    GlobalEventEmitter.sendEvent("igniteAnalytics", "prePurchaseSdkUpdateCountryMarket")
  }
}

