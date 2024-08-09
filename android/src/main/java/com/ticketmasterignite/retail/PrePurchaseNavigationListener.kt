package com.ticketmasterignite.retail

import android.content.Context
import android.content.Intent
import com.ticketmaster.discoveryapi.enums.TMMarketDomain
import com.ticketmaster.discoveryapi.models.DiscoveryAbstractEntity
import com.ticketmaster.discoveryapi.models.DiscoveryEvent
import com.ticketmaster.prepurchase.data.Location
import com.ticketmaster.prepurchase.internal.UpdateLocationInfo
import com.ticketmaster.prepurchase.listener.TMPrePurchaseNavigationListener

class PrePurchaseNavigationListener(
        private val context: Context,
        private val apiKey: String,
        private val closeScreen: () -> Unit
) :
        TMPrePurchaseNavigationListener {
    override fun openEventDetailsPage(
            abstractEntity: DiscoveryAbstractEntity?,
            event: DiscoveryEvent
    ) {
        context.startActivity(
                Intent(
                        context, PurchaseActivity::class.java
                ).apply {
                    putExtra("eventId", event.hostID.orEmpty())
                }
        )
    }

  override fun updateCurrentLocation(updateLocationInfo: (UpdateLocationInfo) -> Unit) {
  }

  override fun onPrePurchaseClosed() {
    closeScreen.invoke()
    }


  override fun onDidRequestCurrentLocation(
    globalMarketDomain: TMMarketDomain?,
    completion: (Location?) -> Unit
  ) {
  }

  override fun onDidRequestNativeLocationSelector() {
  }

  override fun onDidUpdateCurrentLocation(
            globalMarketDomain: TMMarketDomain?,
            location: Location
    ) {
  }

  override fun onPrePurchaseBackPressed() {
  }
}
