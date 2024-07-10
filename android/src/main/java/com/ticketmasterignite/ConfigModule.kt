package com.ticketmasterignite

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ConfigModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "Config"

    @ReactMethod
    fun setConfig(key: String, value: String) {
        Config.set(key, value)
    }
}