package com.ticketmasterignite

import android.app.Application
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.ticketmaster.tickets.ticketssdk.TicketsSDKSingleton
import com.ticketmasterignite.tickets.SecureEntryViewManager
import com.ticketmasterignite.tickets.TicketsViewManager

public class TicketmasterIgnitePackage : ReactPackage {
    override fun createViewManagers(
        reactContext: ReactApplicationContext
    ) = listOf(TicketsViewManager(reactContext), SecureEntryViewManager(reactContext))

   override fun createNativeModules(
        reactContext: ReactApplicationContext
    ): MutableList<NativeModule> {
     TicketsSDKSingleton.init(reactContext.applicationContext as Application)
     GlobalEventEmitter.initialize(reactContext)
     return listOf(
       AccountsSDKModule(reactContext),
       RetailSDKModule(reactContext),
       ConfigModule(reactContext),
     ).toMutableList()
   }
}
