package com.ticketmasterignite

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Callback
import com.ticketmaster.discoveryapi.models.DiscoveryAbstractEntity
import com.ticketmaster.discoveryapi.models.DiscoveryEvent
import com.ticketmaster.prepurchase.action.TMPrePurchaseMenuItem
import com.ticketmaster.prepurchase.listener.TMPrePurchaseUserAnalyticsListener
import com.ticketmasterignite.retail.PrePurchaseActivity
import com.ticketmasterignite.retail.PurchaseActivity
import com.ticketmasterignite.retail.UserAnalyticsListenerSingleton

class RetailSDKModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
  private var userAnalyticsListener: TMPrePurchaseUserAnalyticsListener? = null
  override fun getName() = "RetailSDK"

  @ReactMethod
  fun presentPrePurchaseVenue(venueId: String) {
    val context = currentActivity
    val intent = Intent(context, PrePurchaseActivity::class.java)
    intent.putExtra("venueId", venueId)
    context?.startActivity(intent)
  }

  @ReactMethod
  fun setupUserAnalytics(onEDPSelectedStarted: Callback, onMenuItemSelected: Callback, openURLNotSupported: Callback) {
    userAnalyticsListener = object : TMPrePurchaseUserAnalyticsListener {
      override fun onEDPSelectionStarted(event: DiscoveryEvent) {
        onEDPSelectedStarted(event.toString())
      }

      override fun onMenuItemSelected(
        event: DiscoveryAbstractEntity,
        menuItemSelected: TMPrePurchaseMenuItem
      ) {
        onMenuItemSelected(event, menuItemSelected)
      }

      override fun openURLNotSupported(url: String) {
        openURLNotSupported(url)
      }
    }

    UserAnalyticsListenerSingleton.userAnalyticsListener = userAnalyticsListener
  }

  @ReactMethod
  fun presentPrePurchaseAttraction(attractionId: String) {
    val context = currentActivity
    val intent = Intent(context, PrePurchaseActivity::class.java)
    intent.putExtra("attractionId", attractionId)

    context?.startActivity(intent)
  }

  @ReactMethod
  fun presentPurchase(eventId: String) {
    val context = currentActivity
    val intent = Intent(context, PurchaseActivity::class.java)
    intent.putExtra("eventId", eventId)
    context?.startActivity(intent)
  }
}
