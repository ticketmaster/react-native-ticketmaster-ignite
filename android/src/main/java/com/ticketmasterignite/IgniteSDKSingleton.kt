import com.ticketmaster.authenticationsdk.TMAuthentication

object IgniteSDKSingleton {
  private var authenticationSDK: TMAuthentication? = null

  fun getAuthenticationSDK(): TMAuthentication? {
    return authenticationSDK
  }

  fun setAuthenticationSDK(authSDK: TMAuthentication) {
    authenticationSDK = authSDK
  }
}
