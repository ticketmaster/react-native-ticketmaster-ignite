package com.ticketmasterignite

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap
import com.ticketmasterignitespecs.NativeConfigSpec

class ConfigModule(reactContext: ReactApplicationContext) : NativeConfigSpec(reactContext) {

  override fun getName() = NAME


  override fun setConfig(key: String, value: String) {
    Config.set(key, value)
  }

  override fun setImage(key: String, resolvedImage: ReadableMap) {
    val gson = com.google.gson.Gson()
    val imageJsonString = gson.toJson(resolvedImage.toHashMap())
    Config.setImage(key, imageJsonString)
  }

  companion object {
    const val NAME = "NativeConfig"
  }
}
