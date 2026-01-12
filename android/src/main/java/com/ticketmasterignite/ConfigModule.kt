package com.ticketmasterignite

import com.facebook.react.bridge.ReactApplicationContext
import com.ticketmasterignitespecs.NativeConfigSpec

class ConfigModule(reactContext: ReactApplicationContext) : NativeConfigSpec(reactContext) {

  override fun getName() = NAME


  override fun setConfig(key: String, value: String) {
    Config.set(key, value)
  }

  override fun setImage(key: String, uri: String) {
    Config.setImage(key, uri)
  }

  companion object {
    const val NAME = "NativeConfig"
  }
}
