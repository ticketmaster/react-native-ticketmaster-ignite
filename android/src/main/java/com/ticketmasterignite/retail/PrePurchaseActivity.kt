package com.ticketmasterignite.retail

import android.os.Bundle
import android.graphics.Color
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import com.ticketmasterignite.R
import com.ticketmaster.discoveryapi.enums.TMMarketDomain
import com.ticketmaster.discoveryapi.models.DiscoveryAbstractEntity
import com.ticketmaster.discoveryapi.models.DiscoveryVenue
import com.ticketmaster.discoveryapi.models.DiscoveryAttraction
import com.ticketmaster.prepurchase.TMPrePurchase
import com.ticketmaster.prepurchase.TMPrePurchaseFragmentFactory
import com.ticketmaster.prepurchase.TMPrePurchaseWebsiteConfiguration
import com.ticketmaster.prepurchase.listener.TMPrePurchaseCountrySelectorListener
import com.ticketmaster.prepurchase.listener.TMPrePurchaseFavoritesListener
import com.ticketmaster.prepurchase.listener.TMPrePurchaseSharingListener
import com.ticketmaster.prepurchase.listener.TMPrePurchaseUserAnalyticsListener
import com.ticketmaster.prepurchase.listener.TMPrePurchaseWebAnalyticsListener

class PrePurchaseActivity : AppCompatActivity() {
    private lateinit var fragment: Fragment
    private val userAnalyticsListener: TMPrePurchaseUserAnalyticsListener =
      PrePurchaseUserAnalyticsListener()
    private val countryPickerListener: TMPrePurchaseCountrySelectorListener =
      PrePurchaseCountryPickerListener()
    private val favoritesListener: TMPrePurchaseFavoritesListener =
      PrePurchaseFavoritesListener()
    private val sharingListener: TMPrePurchaseSharingListener =
      PrePurchaseSharingListener()
    private val webAnalyticsListener: TMPrePurchaseWebAnalyticsListener =
      PrePurchaseWebAnalyticsListener()

  override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.venue_layout)

        val tmPrePurchase = TMPrePurchase(
                discoveryAPIKey = Config.get("apiKey"),
                brandColor = Color.parseColor(Config.get("primaryColor"))
        )
        val venueId = intent.getStringExtra("venueId")
        val attractionId = intent.getStringExtra("attractionId")

        val discoveryVenue: DiscoveryAbstractEntity = if (!venueId.isNullOrEmpty()) {
            DiscoveryVenue(hostID = venueId)
        } else {
            DiscoveryAttraction(hostID = attractionId)
        }

        val tmPrePurchaseWebsiteConfiguration = TMPrePurchaseWebsiteConfiguration(
                discoveryVenue,
                TMMarketDomain.US,
        )

        val bundle = tmPrePurchase.getPrePurchaseBundle(
                tmPrePurchaseWebsiteConfiguration
        )

        val factory = TMPrePurchaseFragmentFactory(
                tmPrePurchaseNavigationListener = PrePurchaseNavigationListener(
                        context = this,
                        apiKey = tmPrePurchase.discoveryAPIKey.orEmpty(),
                ) {
                    finish()
                },
          tmPrePurchaseUserAnalyticsListener = userAnalyticsListener,
          tmPrePurchaseWebAnalyticsListener = webAnalyticsListener,
          tmPrePurchaseFavoritesListener = favoritesListener,
          tmPrePurchaseCountryPickerListener = countryPickerListener,
          tmPrePurchaseShareListener = sharingListener,
        ).apply {
            supportFragmentManager.fragmentFactory = this
        }

        fragment = factory.instantiatePrePurchase(ClassLoader.getSystemClassLoader()).apply {
            arguments = bundle
        }

        supportFragmentManager.beginTransaction()
                .add(R.id.venue_container, fragment)
                .commit()
    }
}
