package com.ticketmasterignite.retail

import EventHeader
import android.os.Bundle
import android.graphics.Color
import androidx.appcompat.app.AppCompatActivity
import com.ticketmasterignite.R
import com.ticketmaster.foundation.entity.TMAuthenticationParams
import com.ticketmaster.purchase.TMPurchase
import com.ticketmaster.purchase.TMPurchaseFragmentFactory
import com.ticketmaster.purchase.TMPurchaseWebsiteConfiguration
import com.ticketmaster.purchase.listener.TMPurchaseFavoritesListener
import com.ticketmaster.purchase.listener.TMPurchaseSharingListener
import com.ticketmaster.purchase.listener.TMPurchaseUserAnalyticsListener
import com.ticketmaster.purchase.listener.TMPurchaseWebAnalyticsListener
import com.ticketmasterignite.MarketDomain

class PurchaseActivity : AppCompatActivity() {
  private val userAnalyticsListener: TMPurchaseUserAnalyticsListener =
    PurchaseUserAnalyticsListener { finish() }
  private val webAnalyticsListener: TMPurchaseWebAnalyticsListener =
    PurchaseWebAnalyticsListener()
  private val sharingListener: TMPurchaseSharingListener =
    PurchaseSharingListener()
  private val favoritesListener: TMPurchaseFavoritesListener =
    PurchaseFavoritesListener()

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.venue_layout)
    val eventHeaderType = Config.get("eventHeaderType")

    if (savedInstanceState == null) {
      val tmPurchase = TMPurchase(
        apiKey = Config.get("apiKey"),
        brandColor = Color.parseColor(Config.get("primaryColor"))
      )

      val tmPurchaseWebsiteConfiguration = TMPurchaseWebsiteConfiguration(
        intent.getStringExtra("eventId").orEmpty(),
        TMMarketDomain.US,
        showInfoToolbarButton = EventHeader.getShowInfoToolbarButtonValue(eventHeaderType),
        showShareToolbarButton = EventHeader.getShowShareToolbarButtonValue(eventHeaderType),
      )

      val factory = TMPurchaseFragmentFactory(
        tmPurchaseNavigationListener = PurchaseNavigationListener {
          finish()
        },
        tmPurchaseFavoritesListener = favoritesListener,
        tmPurchaseShareListener = sharingListener,
        tmPurchaseUserAnalyticsListener = userAnalyticsListener,
        tmPurchaseWebAnalyticsListener = webAnalyticsListener
      ).apply {
        supportFragmentManager.fragmentFactory = this
      }

      val tmAuthenticationParams = TMAuthenticationParams(
        apiKey = Config.get("apiKey"),
        clientName = Config.get("clientName"),
        region = Region.getRegion()
      )

      val bundle = tmPurchase.getPurchaseBundle(
        tmPurchaseWebsiteConfiguration,
        tmAuthenticationParams
      )

      val purchaseEDPFragment =
        factory.instantiatePurchase(ClassLoader.getSystemClassLoader()).apply {
          arguments = bundle
        }
      supportFragmentManager.beginTransaction()
        .add(R.id.venue_container, purchaseEDPFragment)
        .commit()
    }
  }
}
