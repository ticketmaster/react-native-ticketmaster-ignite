package com.ticketmasterignite

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import android.content.Context

class ConfigModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "Config"
    private val context: Context = reactContext


  @ReactMethod
    fun setConfig(key: String, value: String) {
        Config.set(key, value)
    }

  @ReactMethod
    fun setImage(key: String, resolvedImage: ReadableMap) {
      val gson = com.google.gson.Gson()
      val imageJsonString = gson.toJson(resolvedImage.toHashMap())
      Config.setImage(key, imageJsonString)
    }
}
