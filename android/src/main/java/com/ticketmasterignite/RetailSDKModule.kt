package com.ticketmasterignite

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.ticketmasterignite.retail.PrePurchaseActivity
import com.ticketmasterignite.retail.PurchaseActivity
import com.ticketmasterignitespecs.NativeRetailSdkSpec

class RetailSDKModule(reactContext: ReactApplicationContext) : NativeRetailSdkSpec(reactContext) {
  override fun getName() = NAME

  override fun presentPrePurchaseVenue(venueId: String) {
    val context = reactApplicationContext.currentActivity
    val intent = Intent(context, PrePurchaseActivity::class.java)
    intent.putExtra("venueId", venueId)
    context?.startActivity(intent)
  }

  override fun presentPrePurchaseAttraction(attractionId: String) {
    val context = reactApplicationContext.currentActivity
    val intent = Intent(context, PrePurchaseActivity::class.java)
    intent.putExtra("attractionId", attractionId)
    context?.startActivity(intent)
  }

  override fun presentPurchase(eventId: String) {
    val context = reactApplicationContext.currentActivity
    val intent = Intent(context, PurchaseActivity::class.java)
    intent.putExtra("eventId", eventId)
    context?.startActivity(intent)
  }

  companion object {
    const val NAME = "NativeRetailSdk"
  }
}
