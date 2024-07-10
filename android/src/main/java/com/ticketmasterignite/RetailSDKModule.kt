package com.ticketmasterignite

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.ticketmasterignite.retail.PrePurchaseActivity
import com.ticketmasterignite.retail.PurchaseActivity

class RetailSDKModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName() = "RetailSDK"

    @ReactMethod
    fun presentPrePurchaseVenue(venueId: String) {
        val context = currentActivity
        val intent = Intent(context, PrePurchaseActivity::class.java)
        intent.putExtra("venueId", venueId)
        context?.startActivity(intent)
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
