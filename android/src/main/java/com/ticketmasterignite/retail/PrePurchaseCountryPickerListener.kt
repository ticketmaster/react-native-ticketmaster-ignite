package com.ticketmasterignite.retail

import com.ticketmaster.discoveryapi.enums.TMMarketDomain
import com.ticketmaster.prepurchase.listener.TMPrePurchaseCountrySelectorListener
import com.ticketmasterignite.GlobalEventEmitter

class PrePurchaseCountryPickerListener: TMPrePurchaseCountrySelectorListener {
  override fun onCountryPickerClosed() {
    GlobalEventEmitter.sendEvent("onCountryPickerClosed", {})
  }

  override fun onCountryPickerDialogDismissed() {
    GlobalEventEmitter.sendEvent("onCountryPickerDialogDismissed", {})
  }

  override fun onCountryPickerOpened() {
    GlobalEventEmitter.sendEvent("onCountryPickerOpened", {})
  }

  override fun onMarketChange(globalMarketDomain: TMMarketDomain) {
    GlobalEventEmitter.sendEvent("onMarketChange", {})
  }

  override fun updateCountryMarket(market: (TMMarketDomain) -> Unit) {
    GlobalEventEmitter.sendEvent("updateCountryMarket", {})
  }
}

