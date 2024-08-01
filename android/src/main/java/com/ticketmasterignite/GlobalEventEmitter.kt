package com.ticketmasterignite

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.modules.core.DeviceEventManagerModule

object GlobalEventEmitter {
  private var reactContext: ReactApplicationContext? = null

  fun initialize(context: ReactApplicationContext) {
    reactContext = context
  }

  fun sendEvent(eventName: String, params: Any?) {
    reactContext?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      ?.emit(eventName, params)
  }
}
