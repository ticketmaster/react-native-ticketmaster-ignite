package com.ticketmasterignite

import Config
import IgniteSDKSingleton
import Region
import android.app.Activity
import android.content.Intent
import android.annotation.SuppressLint
import androidx.compose.material.darkColors
import androidx.compose.material.lightColors
import androidx.compose.ui.graphics.Color
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.google.gson.Gson
import com.ticketmaster.authenticationsdk.AuthSource
import com.ticketmaster.authenticationsdk.TMAuthentication
import com.ticketmaster.tickets.ticketssdk.TicketsColors
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext

class AccountsSDKModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {
  override fun getName() = "AccountsSDK"
  private val CODE = 1
  private var loginPromise: Promise? = null


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

  @ReactMethod
  fun login(promise: Promise) {
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
      val currentFragmentActivity = reactApplicationContext.currentActivity as FragmentActivity
      val intent = authentication.getLoginIntent(currentFragmentActivity)
      reactApplicationContext.currentActivity?.startActivityForResult(intent, CODE)
    } catch (e: Exception) {
      promise.reject("Accounts SDK Login Error", e)
    }
  }


  @ReactMethod
  fun isLoggedIn(promise: Promise) {
    val authenticationSDK = IgniteSDKSingleton.getAuthenticationSDK()
    if (authenticationSDK == null) {
      promise.resolve(false)
      return
    }

    runBlocking {
      try {
        val response = withContext(Dispatchers.IO) {
          AuthSource.values().any { source ->
            authenticationSDK.getToken(source)?.isNotBlank() == true
          }
        }
        promise.resolve(response)
      } catch (e: Exception) {
        promise.reject("Accounts SDK isLoggedIn Error: ", e)
      }
    }
  }

  @ReactMethod
  fun configureAccountsSDK(promise: Promise) {
    runBlocking(Dispatchers.Main) {
      val configurationStartedParams: WritableMap = Arguments.createMap().apply {
        putString(
          "accountsSdkServiceConfigurationStarted",
          "accountsSdkServiceConfigurationStarted"
        )
      }
      GlobalEventEmitter.sendEvent("igniteAnalytics", configurationStartedParams)

      try {
        val currentFragmentActivity = reactApplicationContext.currentActivity as FragmentActivity

        // Pass the required arguments (API key and client name) to the Builder
        val authenticationResult = TMAuthentication.Builder(
          Config.get("apiKey"), // API key
          Config.get("clientName") // Client name
        )
          .colors(createTMAuthenticationColors(android.graphics.Color.parseColor(Config.get("primaryColor"))))
          .environment(Environment.getTMXDeploymentEnvironment(Config.get("environment")))
          .region(Region.getRegion())
          .build(currentFragmentActivity)

        // Unwrap the Result<TMAuthentication> to get the TMAuthentication instance
        val authentication = authenticationResult.getOrThrow()

        // Set the authentication instance in the IgniteSDKSingleton
        IgniteSDKSingleton.setAuthenticationSDK(authentication)

        val serviceConfiguredParams: WritableMap = Arguments.createMap().apply {
          putString("accountsSdkServiceConfigured", "accountsSdkServiceConfigured")
        }
        GlobalEventEmitter.sendEvent("igniteAnalytics", serviceConfiguredParams)

        val configuredCompletedParams: WritableMap = Arguments.createMap().apply {
          putString(
            "accountsSdkServiceConfigurationCompleted",
            "accountsSdkServiceConfigurationCompleted"
          )
        }
        GlobalEventEmitter.sendEvent("igniteAnalytics", configuredCompletedParams)

        promise.resolve("Accounts SDK configuration successful")
      } catch (e: Exception) {
        promise.reject("Accounts SDK Configuration Error: ", e)
      }
    }
  }

  @ReactMethod
  fun logout(promise: Promise) {
    IgniteSDKSingleton.getAuthenticationSDK()?.let { authentication ->
      runBlocking() {
        val logoutStartedParams: WritableMap = Arguments.createMap().apply {
          putString("accountsSdkLogoutStarted", "accountsSdkLogoutStarted")
        }
        GlobalEventEmitter.sendEvent("igniteAnalytics", logoutStartedParams)
        withContext(context = Dispatchers.IO) {
          try {
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
            promise.reject("Accounts SDK Logout Error: ", e)
          }
        }
      }
    }
  }

  @ReactMethod
  fun getMemberInfo(promise: Promise) {
    val authenticationSDK = IgniteSDKSingleton.getAuthenticationSDK()
    if (authenticationSDK == null) {
      promise.resolve(null)
      return
    }

    runBlocking {
      try {
        val archticsAccessToken = async { authenticationSDK.getToken(AuthSource.ARCHTICS) }
        val hostAccessToken = async { authenticationSDK.getToken(AuthSource.HOST) }
        val mfxAccessToken = async { authenticationSDK.getToken(AuthSource.MFX) }
        val sportXRAccessToken = async { authenticationSDK.getToken(AuthSource.SPORTXR) }
        val (resArchticsAccessToken, resHostAccessToken, resMfxAccessToken, resSportXRAccessToken) = awaitAll(
          archticsAccessToken,
          hostAccessToken,
          mfxAccessToken,
          sportXRAccessToken
        )

        if (resArchticsAccessToken.isNullOrEmpty() && resHostAccessToken.isNullOrEmpty() &&
          resMfxAccessToken.isNullOrEmpty() && resSportXRAccessToken.isNullOrEmpty()
        ) {
          promise.resolve(null)
        } else {
          val memberInfoJson = Gson().toJson(authenticationSDK.fetchUserDetails().getOrNull())
          promise.resolve(memberInfoJson)
        }
      } catch (e: Exception) {
        promise.reject("Accounts SDK getMemberInfo Error: ", e)
      }
    }
  }

  @ReactMethod
  fun refreshToken(promise: Promise) {
    val authenticationSDK = IgniteSDKSingleton.getAuthenticationSDK()
    if (authenticationSDK == null) {
      promise.resolve(null)
      return
    }

    runBlocking {
      try {
        val hostAccessToken = authenticationSDK.getToken(AuthSource.HOST)
        val archticsAccessToken = authenticationSDK.getToken(AuthSource.ARCHTICS)
        val mfxAccessToken = authenticationSDK.getToken(AuthSource.MFX)
        val sportXRTokenData = authenticationSDK.getTMAuthToken(AuthSource.SPORTXR)
        val sportXRAccessToken = sportXRTokenData?.accessToken
        val sportXRIdToken = sportXRTokenData?.idToken


        val combinedTokens: WritableMap = Arguments.createMap().apply {
          if (!hostAccessToken.isNullOrEmpty()) {
            putString("hostAccessToken", hostAccessToken)
          }
          if (!archticsAccessToken.isNullOrEmpty()) {
            putString("archticsAccessToken", archticsAccessToken)
          }
          if (!mfxAccessToken.isNullOrEmpty()) {
            putString("mfxAccessToken", mfxAccessToken)
          }
          if (!sportXRAccessToken.isNullOrEmpty()) {
            putString("sportXRAccessToken", sportXRAccessToken)
          }
          if (!sportXRIdToken.isNullOrEmpty()) {
            putString("sportXRIdToken", sportXRIdToken)
          }
        }

        if (archticsAccessToken.isNullOrEmpty() && hostAccessToken.isNullOrEmpty() &&
          mfxAccessToken.isNullOrEmpty() && sportXRAccessToken.isNullOrEmpty()
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

  @ReactMethod
  fun getSportXRData(promise: Promise) {
    val authenticationSDK = IgniteSDKSingleton.getAuthenticationSDK()
    if (authenticationSDK == null) {
      promise.resolve(null)
      return
    }

    runBlocking {
      try {
        val sportXRcookieName = authenticationSDK.configuration.sportXR?.cookieName
        // Not available on Android Accounts SDK yet, manually prefix URL scheme to cookieName for now
        // val sportXRTeamDomain = authenticationSDK.configuration.sportXR?.teamDomain

        val sportXRdata: WritableMap = Arguments.createMap().apply {
          if (!sportXRcookieName.isNullOrEmpty()) {
            putString("sportXRcookieName", sportXRcookieName)
          }
          //  if (!sportXRTeamDomain.isNullOrEmpty()) {
          //   putString("sportXRTeamDomain", sportXRTeamDomain)
          //  }
        }
        promise.resolve(sportXRdata)
      } catch (e: Exception) {
        promise.reject("Accounts SDK SportXR Data Error", e)
      }
    }
  }

  private fun createTicketsColors(color: Int): TicketsColors =
    TicketsColors(
      lightColors(
        primary = Color(color),
        primaryVariant = Color(color),
        secondary = Color(color)
      ),
      darkColors(
        primary = Color(color),
        primaryVariant = Color(color),
        secondary = Color(color)
      )
    )

  @SuppressLint("ConflictingOnColor")
  private fun createTMAuthenticationColors(color: Int): TMAuthentication.ColorTheme =
    TMAuthentication.ColorTheme(
      // The Color class is part of the Compose library
      lightColors(
        primary = Color(color),
        primaryVariant = Color(color),
        secondary = Color(color),
        onPrimary = Color.White // Color used for text and icons displayed on top of the primary color.
      ),
      darkColors(
        primary = Color(color),
        primaryVariant = Color(color),
        secondary = Color(color),
        onPrimary = Color.White // Color used for text and icons displayed on top of the primary color.
      )
    )
}
