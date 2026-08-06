package com.ticketmasterignite

import android.util.Log
import androidx.lifecycle.Observer
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.ticketmaster.authenticationsdk.loginstate.ServiceLoginState

class AccountsAnalyticsObserver : Observer<ServiceLoginState> {

  override fun onChanged(value: ServiceLoginState) {
    val eventName = "igniteAnalytics"
    val params: WritableMap = Arguments.createMap()

    when (value) {
      ServiceLoginState.SERVICE_CONFIGURATION_STARTED -> {
        params.putString("accountsSdkServiceConfigurationStarted", "accountsSdkServiceConfigurationStarted")
      }
      ServiceLoginState.SERVICE_CONFIGURED -> {
        params.putString("accountsSdkServiceConfigured", "accountsSdkServiceConfigured")
      }
      ServiceLoginState.SERVICE_CONFIGURATION_COMPLETED -> {
        params.putString("accountsSdkServiceConfigurationCompleted", "accountsSdkServiceConfigurationCompleted")
      }
      ServiceLoginState.LOGIN_STARTED -> {
        params.putString("accountsSdkLoginStarted", "accountsSdkLoginStarted")
      }
      ServiceLoginState.LOGIN_PRESENTED -> {
        params.putString("accountsSdkLoginPresented", "accountsSdkLoginPresented")
      }
      ServiceLoginState.LOGGED_IN -> {
        params.putString("accountsSdkLoggedIn", "accountsSdkLoggedIn")
      }
      ServiceLoginState.LOGIN_ABORTED -> {
        params.putString("accountsSdkLoginAborted", "accountsSdkLoginAborted")
      }
      ServiceLoginState.LOGIN_FAILED -> {
        params.putString("accountsSdkLoginFailed", "accountsSdkLoginFailed")
      }
      ServiceLoginState.LOGIN_LINK_ACCOUNT_PRESENTED -> {
        params.putString("accountsSdkLoginLinkAccountPresented", "accountsSdkLoginLinkAccountPresented")
      }
      ServiceLoginState.LOGIN_COMPLETED -> {
        params.putString("accountsSdkLoginCompleted", "accountsSdkLoginCompleted")
      }
      ServiceLoginState.TOKEN_REFRESHED -> {
        params.putString("accountsSdkTokenRefreshed", "accountsSdkTokenRefreshed")
      }
      ServiceLoginState.LOGOUT_STARTED -> {
        params.putString("accountsSdkLogoutStarted", "accountsSdkLogoutStarted")
      }
      ServiceLoginState.LOGGED_OUT -> {
        params.putString("accountsSdkLoggedOut", "accountsSdkLoggedOut")
      }
      ServiceLoginState.LOGOUT_COMPLETED -> {
        params.putString("accountsSdkLogoutCompleted", "accountsSdkLogoutCompleted")
      }
      else -> {
        return
      }
    }

    GlobalEventEmitter.sendEvent(eventName, params)
  }
}
