package com.ticketmasterignite

import android.app.Application
import com.facebook.react.BaseReactPackage
import com.facebook.react.ReactPackage
import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager
import com.ticketmaster.tickets.ticketssdk.TicketsSDKSingleton
import com.ticketmasterignite.tickets.SecureEntryViewManager
import com.ticketmasterignite.tickets.TicketsSdkViewManager

class TicketmasterIgnitePackage : BaseReactPackage() {

  private var initialized = false

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return listOf(
      TicketsSdkViewManager()
    )
  }

  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    // Run initialization ONCE
    if (!initialized) {
      initialized = true
      GlobalEventEmitter.initialize(reactContext)
    }

    return when (name) {
      AccountsSdkModule.NAME -> AccountsSdkModule(reactContext)
      ConfigModule.NAME -> ConfigModule(reactContext)
      else -> null
    }
  }

  override fun getReactModuleInfoProvider() =
    ReactModuleInfoProvider {
      mapOf(
        AccountsSdkModule.NAME to ReactModuleInfo(
          name = AccountsSdkModule.NAME,
          className = AccountsSdkModule.NAME,
          canOverrideExistingModule = false,
          needsEagerInit = false,
          isCxxModule = false,
          isTurboModule = true
        ),
        ConfigModule.NAME to ReactModuleInfo(
          name = ConfigModule.NAME,
          className = ConfigModule.NAME,
          canOverrideExistingModule = false,
          needsEagerInit = false,
          isCxxModule = false,
          isTurboModule = true
        )
      )
    }
}
