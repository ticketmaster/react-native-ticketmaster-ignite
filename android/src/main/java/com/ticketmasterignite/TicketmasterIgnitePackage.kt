package com.ticketmasterignite

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.ticketmasterignite.tickets.SecureEntryViewFragmentManager
import com.ticketmasterignite.tickets.TicketsViewManager

public class TicketmasterIgnitePackage : ReactPackage {
    override fun createViewManagers(
        reactContext: ReactApplicationContext
    ) = listOf(TicketsViewManager(reactContext), SecureEntryViewFragmentManager(reactContext))

   override fun createNativeModules(
        reactContext: ReactApplicationContext
    ): MutableList<NativeModule> {
     GlobalEventEmitter.initialize(reactContext)
     return listOf(
       AccountsSDKModule(reactContext),
       RetailSDKModule(reactContext),
       ConfigModule(reactContext),
     ).toMutableList()
   }
}
