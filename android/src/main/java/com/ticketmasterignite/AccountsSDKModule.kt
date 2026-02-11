package com.ticketmasterignite

import Config
import IgniteSDKSingleton
import Region
import android.app.Activity
import android.content.Intent
import android.annotation.SuppressLint
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.ui.graphics.Color
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.ticketmasterignitespecs.NativeAccountsSdkSpec
import com.ticketmaster.authenticationsdk.AuthSource
import com.ticketmaster.authenticationsdk.TMAuthentication
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class AccountsSDKModule(reactContext: ReactApplicationContext) : NativeAccountsSdkSpec(reactContext) {
  override fun getName() = NAME
  private val CODE = 1
  private var loginPromise: Promise? = null
  private var currentActivity = reactContext.currentActivity as FragmentActivity


  override fun configureAccountsSDK(promise: Promise) {
    CoroutineScope(Dispatchers.Main).launch {
      val configurationStartedParams: WritableMap = Arguments.createMap().apply {
        putString(
          "accountsSdkServiceConfigurationStarted",
          "accountsSdkServiceConfigurationStarted"
        )
      }
      GlobalEventEmitter.sendEvent("igniteAnalytics", configurationStartedParams)

      try {
        val currentFragmentActivity = currentActivity
        val authenticationResult = TMAuthentication.Builder(
          Config.get("apiKey"),
          Config.get("clientName")
        )
          .colors(createTMAuthenticationColors(android.graphics.Color.parseColor(Config.get("primaryColor"))))
          .environment(Environment.getTMXDeploymentEnvironment(Config.get("environment")))
          .region(Region.getRegion())
          .build(currentFragmentActivity)

        val authentication = authenticationResult.getOrThrow()
        IgniteSDKSingleton.setAuthenticationSDK(authentication)

        GlobalEventEmitter.sendEvent("igniteAnalytics", Arguments.createMap().apply {
          putString("accountsSdkServiceConfigured", "accountsSdkServiceConfigured")
        })

        GlobalEventEmitter.sendEvent("igniteAnalytics", Arguments.createMap().apply {
          putString(
            "accountsSdkServiceConfigurationCompleted",
            "accountsSdkServiceConfigurationCompleted"
          )
        })

        promise.resolve("Accounts SDK configuration successful")
      } catch (e: Exception) {
        promise.reject("Accounts SDK Configuration Error", e)
      }
    }
  }

  private val loginActivityEventListener: ActivityEventListener =
    object : BaseActivityEventListener() {
      override fun onActivityResult(
        activity: Activity,
        requestCode: Int,
        resultCode: Int,
        data: Intent?
      ) {
        loginPromise?.let { promise ->
          when (resultCode) {
            Activity.RESULT_OK -> {
              val successParams: WritableMap = Arguments.createMap().apply {
                putString("accountsSdkLoggedIn", "accountsSdkLoggedIn")
              }
              GlobalEventEmitter.sendEvent("igniteAnalytics", successParams)

              val completedParams: WritableMap = Arguments.createMap().apply {
                putString("accountsSdkLoginAccountCompleted", "accountsSdkLoginAccountCompleted")
              }
              GlobalEventEmitter.sendEvent("igniteAnalytics", completedParams)
              val result = Arguments.createMap()
              result.putInt("resultCode", Activity.RESULT_OK)
              promise.resolve(result)
            }

            Activity.RESULT_CANCELED -> {
              val canceledParams: WritableMap = Arguments.createMap().apply {
                putString("accountsSdkLoginAborted", "accountsSdkLoginAborted")
              }
              GlobalEventEmitter.sendEvent("igniteAnalytics", canceledParams)
              val result = Arguments.createMap()
              result.putInt("resultCode", Activity.RESULT_CANCELED)
              promise.resolve(result)
            }

            else -> {
              promise.reject("Accounts SDK Login Error", "Login failed")
            }
          }
          loginPromise = null
        }
      }
    }

  init {
    reactContext.addActivityEventListener(loginActivityEventListener)
  }

  override fun login(promise: Promise) {
    val loginStartedParams: WritableMap = Arguments.createMap().apply {
      putString("accountsSdkLoginStarted", "accountsSdkLoginStarted")
    }
    GlobalEventEmitter.sendEvent("igniteAnalytics", loginStartedParams)
    try {
      val authentication = IgniteSDKSingleton.getAuthenticationSDK()

      if (authentication == null) {
        promise.reject("Accounts SDK Login Error", "Accounts SDK not initialized")
        return
      }

      loginPromise = promise
      val currentFragmentActivity = currentActivity
      val intent = authentication.getLoginIntent(currentFragmentActivity)
      currentActivity.startActivityForResult(intent, CODE)
    } catch (e: Exception) {
      promise.reject("Accounts SDK Login Error", e)
    }
  }

  override fun logout(promise: Promise) {
    val authentication = IgniteSDKSingleton.getAuthenticationSDK()
    if (authentication == null) {
      promise.resolve(false)
      return
    }

    CoroutineScope(Dispatchers.IO).launch {
      try {
        val logoutStartedParams: WritableMap = Arguments.createMap().apply {
          putString("accountsSdkLogoutStarted", "accountsSdkLogoutStarted")
        }
        GlobalEventEmitter.sendEvent("igniteAnalytics", logoutStartedParams)

        authentication.logout()

        val loggedOutParams: WritableMap = Arguments.createMap().apply {
          putString("accountsSdkLoggedOut", "accountsSdkLoggedOut")
        }
        GlobalEventEmitter.sendEvent("igniteAnalytics", loggedOutParams)

        val logoutCompletedParams: WritableMap = Arguments.createMap().apply {
          putString("accountsSdkLogoutCompleted", "accountsSdkLogoutCompleted")
        }
        GlobalEventEmitter.sendEvent("igniteAnalytics", logoutCompletedParams)

        promise.resolve(true)
      } catch (e: Exception) {
        promise.reject("Accounts SDK Logout Error", e)
      }
    }
  }

  override fun logoutAll(promise: Promise) {
    val authentication = IgniteSDKSingleton.getAuthenticationSDK()
    if (authentication == null) {
      promise.resolve(false)
      return
    }

    CoroutineScope(Dispatchers.IO).launch {
      try {
        val logoutStartedParams: WritableMap = Arguments.createMap().apply {
          putString("accountsSdkLogoutStarted", "accountsSdkLogoutStarted")
        }
        GlobalEventEmitter.sendEvent("igniteAnalytics", logoutStartedParams)

        authentication.logout()

        val loggedOutParams: WritableMap = Arguments.createMap().apply {
          putString("accountsSdkLoggedOut", "accountsSdkLoggedOut")
        }
        GlobalEventEmitter.sendEvent("igniteAnalytics", loggedOutParams)

        val logoutCompletedParams: WritableMap = Arguments.createMap().apply {
          putString("accountsSdkLogoutCompleted", "accountsSdkLogoutCompleted")
        }
        GlobalEventEmitter.sendEvent("igniteAnalytics", logoutCompletedParams)

        promise.resolve(true)
      } catch (e: Exception) {
        promise.reject("Accounts SDK LogoutAll Error", e)
      }
    }
  }


  override fun isLoggedIn(promise: Promise) {
    val authenticationSDK = IgniteSDKSingleton.getAuthenticationSDK()
    if (authenticationSDK == null) {
      promise.resolve(false)
      return
    }

    CoroutineScope(Dispatchers.IO).launch {
      try {
        val response = AuthSource.values().any { source ->
          authenticationSDK.getToken(source)?.isNotBlank() == true
        }
        promise.resolve(response)
      } catch (e: Exception) {
        promise.reject("Accounts SDK isLoggedIn Error", e)
      }
    }
  }

  override fun getMemberInfo(promise: Promise) {
    val authenticationSDK = IgniteSDKSingleton.getAuthenticationSDK()
      ?: return promise.resolve(null)

    CoroutineScope(Dispatchers.IO).launch {
      try {
        val tokens = listOf(
          authenticationSDK.getToken(AuthSource.HOST),
          authenticationSDK.getToken(AuthSource.ARCHTICS),
          authenticationSDK.getToken(AuthSource.MFX),
          authenticationSDK.getTMAuthToken(AuthSource.SPORTXR)?.accessToken
        )

        if (tokens.all { it.isNullOrEmpty() }) {
          promise.resolve(null)
          // return@launch exits the CoroutineScope, code outside the CoroutineScope will still run
          return@launch
        }

        val memberInfo = authenticationSDK.fetchUserDetails().getOrNull()
          ?: return@launch promise.resolve(null)

        val memberInfoData = Arguments.createMap()

        // Choose first non-null member with an email
        val selectedMember = listOfNotNull(
          memberInfo.archticsMember?.takeIf { !it.email.isNullOrEmpty() },
          memberInfo.sportXRMember?.takeIf { !it.email.isNullOrEmpty() },
          memberInfo.mfxMember?.takeIf { !it.email.isNullOrEmpty() },
          memberInfo.hostMember?.takeIf { !it.email.isNullOrEmpty() }
        ).firstOrNull()

        if (selectedMember != null) {
          val json = Gson().toJson(selectedMember)
          val memberMap: Map<String, Any> = Gson().fromJson(
            json, object : TypeToken<Map<String, Any>>() {}.type
          )
          fillWritableMap(memberInfoData, memberMap)
        }

        promise.resolve(memberInfoData)
      } catch (e: Exception) {
        promise.reject("Accounts SDK getMemberInfo Error", e)
      }
    }
  }

  override fun getToken(promise: Promise) {
    val authenticationSDK = IgniteSDKSingleton.getAuthenticationSDK()
    if (authenticationSDK == null) {
      promise.resolve(null)
      return
    }

    CoroutineScope(Dispatchers.IO).launch {
      try {
        val hostAccessToken = authenticationSDK.getToken(AuthSource.HOST)
        val archticsAccessToken = authenticationSDK.getToken(AuthSource.ARCHTICS)
        val mfxAccessToken = authenticationSDK.getToken(AuthSource.MFX)
        val sportXRTokenData = authenticationSDK.getTMAuthToken(AuthSource.SPORTXR)
        val sportXRAccessToken = sportXRTokenData?.accessToken
        val sportXRIdToken = sportXRTokenData?.idToken

        val combinedTokens: WritableMap = Arguments.createMap().apply {
          if (!archticsAccessToken.isNullOrEmpty()) {
            putString("accessToken", archticsAccessToken)
          } else if (!sportXRAccessToken.isNullOrEmpty()) {
            putString("accessToken", sportXRAccessToken)
          } else if (!mfxAccessToken.isNullOrEmpty()) {
            putString("accessToken", mfxAccessToken)
          } else if (!hostAccessToken.isNullOrEmpty()) {
            putString("accessToken", hostAccessToken)
          }
          if (!sportXRIdToken.isNullOrEmpty()) {
            putString("sportXRIdToken", sportXRIdToken)
          }
        }

        if (archticsAccessToken.isNullOrEmpty() &&
          hostAccessToken.isNullOrEmpty() &&
          mfxAccessToken.isNullOrEmpty() &&
          sportXRAccessToken.isNullOrEmpty()
        ) {
          promise.resolve(null)
        } else {
          val tokenRefreshedParams: WritableMap = Arguments.createMap().apply {
            putString("accountsSdkTokenRefreshed", "accountsSdkTokenRefreshed")
          }
          GlobalEventEmitter.sendEvent("igniteAnalytics", tokenRefreshedParams)
          promise.resolve(combinedTokens)
        }
      } catch (e: Exception) {
        promise.reject("Accounts SDK getToken Error", e)
      }
    }
  }


  override fun refreshToken(promise: Promise) {
    val authenticationSDK = IgniteSDKSingleton.getAuthenticationSDK()
    if (authenticationSDK == null) {
      promise.resolve(null)
      return
    }

    CoroutineScope(Dispatchers.IO).launch {
      try {
        val hostAccessToken = authenticationSDK.getToken(AuthSource.HOST)
        val archticsAccessToken = authenticationSDK.getToken(AuthSource.ARCHTICS)
        val mfxAccessToken = authenticationSDK.getToken(AuthSource.MFX)
        val sportXRTokenData = authenticationSDK.getTMAuthToken(AuthSource.SPORTXR)
        val sportXRAccessToken = sportXRTokenData?.accessToken
        val sportXRIdToken = sportXRTokenData?.idToken

        val combinedTokens: WritableMap = Arguments.createMap().apply {
          if (!archticsAccessToken.isNullOrEmpty()) {
            putString("accessToken", archticsAccessToken)
          } else if (!sportXRAccessToken.isNullOrEmpty()) {
            putString("accessToken", sportXRAccessToken)
          } else if (!mfxAccessToken.isNullOrEmpty()) {
            putString("accessToken", mfxAccessToken)
          } else if (!hostAccessToken.isNullOrEmpty()) {
            putString("accessToken", hostAccessToken)
          }
          if (!sportXRIdToken.isNullOrEmpty()) {
            putString("sportXRIdToken", sportXRIdToken)
          }
        }

        if (archticsAccessToken.isNullOrEmpty() &&
          hostAccessToken.isNullOrEmpty() &&
          mfxAccessToken.isNullOrEmpty() &&
          sportXRAccessToken.isNullOrEmpty()
        ) {
          promise.resolve(null)
        } else {
          val tokenRefreshedParams: WritableMap = Arguments.createMap().apply {
            putString("accountsSdkTokenRefreshed", "accountsSdkTokenRefreshed")
          }
          GlobalEventEmitter.sendEvent("igniteAnalytics", tokenRefreshedParams)
          promise.resolve(combinedTokens)
        }
      } catch (e: Exception) {
        promise.reject("Accounts SDK refreshToken Error", e)
      }
    }
  }

  override fun getSportXRData(promise: Promise) {
    val authenticationSDK = IgniteSDKSingleton.getAuthenticationSDK()
    if (authenticationSDK == null) {
      promise.resolve(null)
      return
    }

    CoroutineScope(Dispatchers.IO).launch {
      try {
        val sportXRcookieName = authenticationSDK.configuration.sportXR?.cookieName
        // val sportXRTeamDomain = authenticationSDK.configuration.sportXR?.teamDomain // not yet available on Android

        val sportXRdata: WritableMap = Arguments.createMap().apply {
          if (!sportXRcookieName.isNullOrEmpty()) {
            putString("sportXRcookieName", sportXRcookieName)
          }
          // if (!sportXRTeamDomain.isNullOrEmpty()) {
          //   putString("sportXRTeamDomain", sportXRTeamDomain)
          // }
        }

        promise.resolve(sportXRdata)
      } catch (e: Exception) {
        promise.reject("Accounts SDK SportXR Data Error", e)
      }
    }
  }

  private fun fillWritableMap(dest: WritableMap, src: Map<String, Any>) {
    src.forEach { (key, value) -> putValue(dest, key, value) }
  }

  private fun convertMap(map: Map<*, *>): WritableMap =
    Arguments.createMap().apply {
      map.forEach { (key, value) ->
        if (key is String) putValue(this, key, value)
      }
    }

  private fun convertArray(list: List<*>): WritableArray =
    Arguments.createArray().apply {
      list.forEach { value -> pushValue(this, value) }
    }

  private fun putValue(dest: WritableMap, key: String, value: Any?) {
    when (value) {
      null -> dest.putNull(key)
      is String -> dest.putString(key, value)
      is Number -> dest.putDouble(key, value.toDouble())
      is Boolean -> dest.putBoolean(key, value)
      is Map<*, *> -> dest.putMap(key, convertMap(value))
      is List<*> -> dest.putArray(key, convertArray(value))
      else -> dest.putString(key, value.toString())
    }
  }

  private fun pushValue(dest: WritableArray, value: Any?) {
    when (value) {
      null -> dest.pushNull()
      is String -> dest.pushString(value)
      is Number -> dest.pushDouble(value.toDouble())
      is Boolean -> dest.pushBoolean(value)
      is Map<*, *> -> dest.pushMap(convertMap(value))
      is List<*> -> dest.pushArray(convertArray(value))
      else -> dest.pushString(value.toString())
    }
  }

  @SuppressLint("ConflictingOnColor")
  private fun createTMAuthenticationColors(color: Int): TMAuthentication.ColorTheme =
    TMAuthentication.ColorTheme(
      // The Color class is part of the Compose library
      lightColorScheme(
        primary = Color(color),
        secondary = Color(color),
        onPrimary = Color.White // Color used for text and icons displayed on top of the primary color.
      ),
      darkColorScheme(
        primary = Color(color),
        secondary = Color(color),
        onPrimary = Color.White // Color used for text and icons displayed on top of the primary color.
      )
    )

  companion object {
    const val NAME = "NativeAccountsSdk"
  }
}
