package com.ticketmasterignite

import android.app.Activity
import android.content.Intent
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
import com.ticketmaster.authenticationsdk.TMXDeploymentEnvironment
import com.ticketmaster.tickets.ticketssdk.TicketsColors
import com.ticketmaster.tickets.ticketssdk.TicketsSDKClient
import com.ticketmaster.tickets.ticketssdk.TicketsSDKSingleton
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import Config
import Region

class AccountsSDKModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {
  private val CODE = 1
  override fun getName() = "AccountsSDK"
  private var mResultCallback: Callback? = null

  private val mActivityEventListener: ActivityEventListener =
    object : BaseActivityEventListener() {
      override fun onActivityResult(
        activity: Activity?,
        requestCode: Int,
        resultCode: Int,
        data: Intent?
      ) {
        if (mResultCallback != null) {
          mResultCallback!!.invoke(resultCode)
          mResultCallback = null
        }
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
      }
    }

  init {
    reactContext.addActivityEventListener(mActivityEventListener)
  }

  @ReactMethod
  fun login(resultCallback: Callback) {
    runBlocking() {
      val loginStartedParams: WritableMap = Arguments.createMap().apply {
        putString("accountsSdkLoginStarted", "accountsSdkLoginStarted")
      }
      GlobalEventEmitter.sendEvent("igniteAnalytics", loginStartedParams)
      mResultCallback = resultCallback
      val currentFragmentActivity = currentActivity as FragmentActivity
      val authentication = TMAuthentication.Builder()
        .apiKey(Config.get("apiKey"))
        .clientName(Config.get("clientName")) // Team name to be displayed
        .colors(TMAuthentication.ColorTheme())
        .environment(TMXDeploymentEnvironment.Production) // Environment that the SDK will use. Default is Production
        .region(Region.getRegion()) // Region that the SDK will use. Default is US
        .build(currentFragmentActivity)
      val intent = authentication.getLoginIntent(currentFragmentActivity)
      currentActivity?.startActivityForResult(intent, CODE)
    }
  }

  @ReactMethod
  fun isLoggedIn(promise: Promise) =
    TicketsSDKSingleton.getTMAuthentication()?.let { authentication ->
      runBlocking {
        try {
          val response = withContext(context = Dispatchers.IO) {
            AuthSource.values().forEach {
              if (authentication.getToken(it)?.isNotBlank() == true) {
                return@withContext true
              }
            }
            return@withContext false
          }

          promise.resolve(response)
        } catch (e: Exception) {
          promise.reject("Accounts SDK isLoggedIn Error: ", e)
        }
      }
    } ?: false

  @ReactMethod
  fun configureAccountsSDK(promise: Promise) {
    runBlocking(Dispatchers.Main) {
      val region = Config.get("region")

      val configurationStartedParams: WritableMap = Arguments.createMap().apply {
        putString(
          "accountsSdkServiceConfigurationStarted",
          "accountsSdkServiceConfigurationStarted"
        )
      }
      GlobalEventEmitter.sendEvent("igniteAnalytics", configurationStartedParams)
      try {
        val currentFragmentActivity = currentActivity as FragmentActivity
        val authentication = TMAuthentication.Builder()
          .apiKey(Config.get("apiKey"))
          .clientName(Config.get("clientName"))
          .colors(TMAuthentication.ColorTheme())
          .environment(TMXDeploymentEnvironment.Production)
          .region(Region.getRegion())
          .build(currentFragmentActivity)

        val serviceConfiguredParams: WritableMap = Arguments.createMap().apply {
          putString("accountsSdkServiceConfigured", "accountsSdkServiceConfigured")
        }
        GlobalEventEmitter.sendEvent("igniteAnalytics", serviceConfiguredParams)

        TicketsSDKClient
          .Builder()
          .authenticationSDKClient(authentication)
          .colors(createTicketsColors(android.graphics.Color.parseColor(Config.get("primaryColor"))))
          .build(currentFragmentActivity)
          .apply {
            TicketsSDKSingleton.setTicketsSdkClient(this)
            val configuredCompletedParams: WritableMap = Arguments.createMap().apply {
              putString(
                "accountsSdkServiceConfiguredCompleted",
                "accountsSdkServiceConfiguredCompleted"
              )
            }
            GlobalEventEmitter.sendEvent("igniteAnalytics", configuredCompletedParams)
            promise.resolve(true)
          }
      } catch (e: Exception) {
        promise.reject("Accounts SDK Configuration Error: ", e)
      }
    }
  }

  @ReactMethod
  fun logout(promise: Promise) {
    runBlocking {
      val logoutStartedParams: WritableMap = Arguments.createMap().apply {
        putString("accountsSdkLogoutStarted", "accountsSdkLogoutStarted")
      }
      GlobalEventEmitter.sendEvent("igniteAnalytics", logoutStartedParams)
      withContext(context = Dispatchers.IO) {
        try {
          val currentFragmentActivity = currentActivity as FragmentActivity
          val authentication = TMAuthentication.Builder()
            .apiKey(Config.get("apiKey"))
            .clientName(Config.get("clientName"))
            .colors(TMAuthentication.ColorTheme())
            .environment(TMXDeploymentEnvironment.Production)
            .region(Region.getRegion())
            .build(currentFragmentActivity)
          authentication.logout(currentFragmentActivity)
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

  @ReactMethod
  fun getMemberInfo(promise: Promise) = TicketsSDKSingleton.getTMAuthentication()?.let {
    runBlocking {
      try {
        val archticsAccessToken = async { it.getToken(AuthSource.ARCHTICS) }
        val hostAccessToken = async { it.getToken(AuthSource.HOST) }
        val mfxAccessToken = async { it.getToken(AuthSource.MFX) }
        val sportXRAccessToken = async { it.getToken(AuthSource.SPORTXR) }
        val (resArchticsAccessToken, resHostAccessToken, resMfxAccessToken, resSportXRAccessToken) = awaitAll(
          archticsAccessToken,
          hostAccessToken,
          mfxAccessToken,
          sportXRAccessToken
        )

        if (resArchticsAccessToken.isNullOrEmpty() && resHostAccessToken.isNullOrEmpty() && resMfxAccessToken.isNullOrEmpty() && resSportXRAccessToken.isNullOrEmpty()) {
          promise.resolve(null)
        } else {
          val memberInfoJson = Gson().toJson(it.fetchUserDetails().getOrNull())
          promise.resolve(memberInfoJson)
        }
      } catch (e: Exception) {
        promise.reject("Accounts SDK getMemberInfo Error: ", e)
      }
    }
  }

  @ReactMethod
  fun refreshToken(promise: Promise) = TicketsSDKSingleton.getTMAuthentication()?.let {
    runBlocking {
      try {
        val hostAccessToken = async { it.getToken(AuthSource.HOST) }
        val archticsAccessToken = async { it.getToken(AuthSource.ARCHTICS) }
        val mfxAccessToken = async { it.getToken(AuthSource.MFX) }
        val sportXRAccessToken = async { it.getToken(AuthSource.SPORTXR) }
        val (resArchticsAccessToken, resHostAccessToken, resMfxAccessToken, resSportXRAccessToken) = awaitAll(
          archticsAccessToken,
          hostAccessToken,
          mfxAccessToken,
          sportXRAccessToken
        )
        val tokenRefreshedParams: WritableMap = Arguments.createMap().apply {
          putString("accountsSdkTokenRefreshed", "accountsSdkTokenRefreshed")
        }
        val combinedTokens: WritableMap = Arguments.createMap()
        if (!resHostAccessToken.isNullOrEmpty()) {
          combinedTokens.putString("hostAccessToken", resHostAccessToken)
        }
        if (!resArchticsAccessToken.isNullOrEmpty()) {
          combinedTokens.putString("archticsAccessToken", resArchticsAccessToken)
        }
        if (!resMfxAccessToken.isNullOrEmpty()) {
          combinedTokens.putString("mfxAccessToken", resMfxAccessToken)
        }
        if (!resSportXRAccessToken.isNullOrEmpty()) {
          combinedTokens.putString("sportXRAccessToken", resSportXRAccessToken)
        }
        GlobalEventEmitter.sendEvent("igniteAnalytics", tokenRefreshedParams)
        promise.resolve(combinedTokens)
      } catch (e: Exception) {
        promise.reject("Accounts SDK refreshToken Error: ", e)
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
}
