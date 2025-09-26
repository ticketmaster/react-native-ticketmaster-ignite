package com.ticketmasterignite

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
import com.facebook.react.bridge.Callback
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
  private val CODE = 1
  override fun getName() = "AccountsSDK"
  private var mResultCallback: Callback? = null

  private val mActivityEventListener: ActivityEventListener =
    object : BaseActivityEventListener() {
      override fun onActivityResult(
        activity: Activity,
        requestCode: Int,
        resultCode: Int,
        data: Intent?
      ) {
        if (resultCode == Activity.RESULT_CANCELED) {
          val params: WritableMap = Arguments.createMap().apply {
            putString("accountsSdkLoginAborted", "accountsSdkLoginAborted")
          }
          GlobalEventEmitter.sendEvent("igniteAnalytics", params)
        }
        if (resultCode == Activity.RESULT_OK) {
          val params: WritableMap = Arguments.createMap().apply {
            putString("accountsSdkLoggedIn", "accountsSdkLoggedIn")
          }
          GlobalEventEmitter.sendEvent("igniteAnalytics", params)
          val loginCompletedParams: WritableMap = Arguments.createMap().apply {
            putString("accountsSdkLoginAccountCompleted", "accountsSdkLoginAccountCompleted")
          }
          GlobalEventEmitter.sendEvent("igniteAnalytics", loginCompletedParams)
        }
        if (mResultCallback != null) {
          mResultCallback!!.invoke(resultCode)
          mResultCallback = null
        }
      }
    }

  init {
    reactContext.addActivityEventListener(mActivityEventListener)
  }

  @ReactMethod
  fun login(resultCallback: Callback) {
    val let = IgniteSDKSingleton.getAuthenticationSDK()?.let { authentication ->
      runBlocking() {
        val loginStartedParams: WritableMap = Arguments.createMap().apply {
          putString("accountsSdkLoginStarted", "accountsSdkLoginStarted")
        }
        GlobalEventEmitter.sendEvent("igniteAnalytics", loginStartedParams)
        mResultCallback = resultCallback
        val currentFragmentActivity = reactApplicationContext.currentActivity as FragmentActivity
        val intent = authentication.getLoginIntent(currentFragmentActivity)
        reactApplicationContext.currentActivity?.startActivityForResult(intent, CODE)
      }
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

        val tokenRefreshedParams: WritableMap = Arguments.createMap().apply {
          putString("accountsSdkTokenRefreshed", "accountsSdkTokenRefreshed")
        }
        GlobalEventEmitter.sendEvent("igniteAnalytics", tokenRefreshedParams)

        if (archticsAccessToken.isNullOrEmpty() && hostAccessToken.isNullOrEmpty() &&
          mfxAccessToken.isNullOrEmpty() && sportXRAccessToken.isNullOrEmpty()
        ) {
          promise.resolve(null)
        } else {
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
