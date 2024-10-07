package com.ticketmasterignite.retail

import android.os.Bundle
import android.graphics.Color
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.ticketmasterignite.R
import com.ticketmaster.authenticationsdk.TMXDeploymentRegion
import com.ticketmaster.discoveryapi.enums.TMMarketDomain
import com.ticketmaster.foundation.entity.TMAuthenticationParams
import com.ticketmaster.purchase.TMPurchase
import com.ticketmaster.purchase.TMPurchaseFragmentFactory
import com.ticketmaster.purchase.TMPurchaseWebsiteConfiguration
import com.ticketmaster.purchase.listener.TMPurchaseFavoritesListener
import com.ticketmaster.purchase.listener.TMPurchaseSharingListener
import com.ticketmaster.purchase.listener.TMPurchaseUserAnalyticsListener
import com.ticketmaster.purchase.listener.TMPurchaseWebAnalyticsListener
import Region

class PurchaseActivity : AppCompatActivity() {
  private val userAnalyticsListener: TMPurchaseUserAnalyticsListener =
    PurchaseUserAnalyticsListener()
  private val webAnalyticsListener: TMPurchaseWebAnalyticsListener =
    PurchaseWebAnalyticsListener()
  private val sharingListener: TMPurchaseSharingListener =
    PurchaseSharingListener()
  private val favoritesListener: TMPurchaseFavoritesListener =
    PurchaseFavoritesListener()

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.venue_layout)

    if (savedInstanceState == null) {
      val tmPurchase = TMPurchase(
        apiKey = Config.get("apiKey"),
        brandColor = Color.parseColor(Config.get("primaryColor"))
      )

      val tmPurchaseWebsiteConfiguration = TMPurchaseWebsiteConfiguration(
        intent.getStringExtra("eventId").orEmpty(),
        TMMarketDomain.US,
        showInfoToolbarButton = true,
        showShareToolbarButton = true
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
