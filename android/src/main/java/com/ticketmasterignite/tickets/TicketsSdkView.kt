package com.ticketmasterignite.tickets

import android.content.Context
import android.util.Log
import android.view.View
import android.view.ViewTreeObserver
import android.widget.FrameLayout
import com.facebook.react.uimanager.ThemedReactContext
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.ui.graphics.Color
import androidx.core.graphics.toColorInt
import androidx.fragment.app.FragmentActivity
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.ticketmaster.authenticationsdk.AuthSource
import com.ticketmaster.authenticationsdk.TMAuthentication
import com.ticketmaster.tickets.EventOrders
import com.ticketmaster.tickets.TicketsModuleDelegate
import com.ticketmaster.tickets.event_tickets.*
import com.ticketmaster.tickets.ticketssdk.TicketsColor
import com.ticketmaster.tickets.ticketssdk.TicketsColorScheme
import com.ticketmaster.tickets.ticketssdk.TicketsSDKClient
import com.ticketmaster.tickets.ticketssdk.TicketsSDKSingleton
import com.ticketmaster.tickets.venuenext.VenueNextModule
import com.ticketmasterignite.Environment
import com.ticketmasterignite.GlobalEventEmitter
import com.ticketmasterignite.R
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

class TicketsSdkView(context: Context) : FrameLayout(context) {

  private var offsetTop: Int = 0
  private var lastAuthState: Boolean? = null // null = not checked yet, true = logged in, false = logged out

  // Main thread scope for UI operations (fragment transactions, view updates)
  private val mainScope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)

  // Background scope for auth/network operations
  private val ioScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)

  init {
    val container = FrameLayout(context)
    container.id = R.id.tickets_container
    addView(container)
    setupTicketsSDK()
  }

  fun setOffsetTop(offset: Int) {
    offsetTop = offset
    // Apply offset to the view
    this.offsetTopAndBottom(offsetTop)
  }

  private fun isViewAttached(): Boolean {
    return isAttachedToWindow
  }

  private fun isViewReady(): Boolean {
    return isViewAttached() && width > 0 && height > 0
  }

  private fun isContainerReady(): Boolean {
    val container = findViewById<FrameLayout>(R.id.tickets_container)
    return container != null && container.isAttachedToWindow
  }


  override fun onVisibilityChanged(changedView: View, visibility: Int) {
    super.onVisibilityChanged(changedView, visibility)

    if (visibility == View.VISIBLE && changedView == this) {
      checkAuthStateAndUpdate()
    }
  }

  private fun checkAuthStateAndUpdate() {
    ioScope.launch {
      val authentication = IgniteSDKSingleton.getAuthenticationSDK()
      if (authentication != null) {
        val tokenMap = validateAuthToken(authentication)
        val currentAuthState = tokenMap.isNotEmpty()

        if (lastAuthState != null && lastAuthState != currentAuthState) {
          // Auth state changed (logged in → logged out OR logged out → logged in)
          mainScope.launch {
            reinitializeView()
          }
        }

        // Update tracked state
        lastAuthState = currentAuthState
      }
    }
  }

  private fun reinitializeView() {
    mainScope.launch {
      if (!isViewAttached()) {
        return@launch
      }

      // Remove existing fragment
      val activity = getFragmentActivity()
      if (activity == null || activity.isFinishing || activity.isDestroyed) {
        return@launch
      }

      activity.supportFragmentManager.findFragmentById(R.id.tickets_container)?.let { fragment ->
        activity.supportFragmentManager.beginTransaction()
          .remove(fragment)
          .commitAllowingStateLoss()
      }

      // Check again before modifying view hierarchy
      if (!isViewAttached()) {
        return@launch
      }

      // Remove existing container
      findViewById<FrameLayout>(R.id.tickets_container)?.let { existingContainer ->
        removeView(existingContainer)
      }

      // Recreate container
      val container = FrameLayout(context)
      container.id = R.id.tickets_container
      addView(container)

      // Re-run full setup
      setupTicketsSDK()
    }
  }

  private fun createTicketsColorScheme(color: Int): TicketsColorScheme {
    val ticketsColor = TicketsColor(color.toLong() and 0xFFFFFFFFL)
    return TicketsColorScheme(
      primary = ticketsColor,
      eventsTopBar = ticketsColor
    )
  }

  private fun createAuthColors(color: Int): TMAuthentication.ColorTheme =
    TMAuthentication.ColorTheme(
      lightColorScheme(primary = Color(color), secondary = Color(color)),
      darkColorScheme(primary = Color(color), secondary = Color(color))
    )

  private suspend fun validateAuthToken(authentication: TMAuthentication): Map<AuthSource, String> {
    val tokenMap = mutableMapOf<AuthSource, String>()
    AuthSource.entries.forEach {
      authentication.getToken(it)?.let { token ->
        tokenMap[it] = token
      }
    }
    return tokenMap
  }

  private fun getFragmentActivity(): FragmentActivity? {
    return when (val ctx = context) {
      is FragmentActivity -> ctx
      is ThemedReactContext -> ctx.currentActivity as? FragmentActivity
      else -> null
    }
  }

  private val measureAndLayout = Runnable {
    if (!isViewReady()) {
      return@Runnable
    }

    measure(
      MeasureSpec.makeMeasureSpec(width, MeasureSpec.EXACTLY),
      MeasureSpec.makeMeasureSpec(height, MeasureSpec.EXACTLY)
    )
    layout(left, top, right, bottom)
  }

  override fun requestLayout() {
    super.requestLayout()
    post(measureAndLayout)
  }

  private fun launchTicketsView() {
    if (!isViewAttached()) {
      addOnAttachStateChangeListener(object : View.OnAttachStateChangeListener {
        override fun onViewAttachedToWindow(v: View) {
          removeOnAttachStateChangeListener(this)
          launchTicketsView()
        }
        override fun onViewDetachedFromWindow(v: View) {}
      })
      return
    }

    val activity = getFragmentActivity()
    if (activity == null || activity.isFinishing || activity.isDestroyed) {
      return
    }

    if (!isContainerReady()) {
      return
    }

    TicketsSDKSingleton.getEventsFragment(context)?.let { fragment ->
      activity.supportFragmentManager.beginTransaction()
        .replace(R.id.tickets_container, fragment)
        .commitAllowingStateLoss()
    }

    if (Config.get("orderIdDeepLink").isNotBlank()) {
      TicketsSDKSingleton.jumpToOrderOrEvent(context, Config.get("orderIdDeepLink"))
      Config.set("orderIdDeepLink", "")
    }
  }

  private fun getImageOverride(imageName: String): ModuleBase.ImageOverride? {
    return Config.getImage(imageName)?.let { imageUri ->
      when {
        imageUri.contains("10.0.") -> {
          ModuleBase.ImageOverride(url = imageUri)
        }
        imageUri.isNotEmpty() -> {
          val resourceName = imageUri.substringAfterLast('/').substringBeforeLast('.')
          val resourceId = context.resources?.getIdentifier(resourceName, "drawable", context.packageName)

          if (resourceId != null && resourceId != 0) {
            ModuleBase.ImageOverride(src = resourceId)
          } else {
            null
          }
        }
        else -> null
      }
    }
  }

  private fun getCustomModule(context: Context): ModuleBase {
    val moduleBase = ModuleBase(context)

    if (Config.get("button1") == "true") {
      moduleBase.setLeftButtonText(Config.get("button1Title"))
    }
    if (Config.get("button2") == "true") {
      moduleBase.setMiddleButtonText(Config.get("button2Title"))
    }
    if (Config.get("button3") == "true") {
      moduleBase.setRightButtonText(Config.get("button3Title"))
    }

    // Empty listeners needed for button clicks to trigger callbacks
    moduleBase.setLeftClickListener {}
    moduleBase.setMiddleClickListener {}
    moduleBase.setRightClickListener {}

    return moduleBase
  }

  private fun setCustomModules() {
    TicketsSDKSingleton.moduleDelegate = object : TicketsModuleDelegate {
      override fun getCustomModulesLiveData(order: TicketsModuleDelegate.Order): LiveData<List<TicketsSDKModule>> {
        val modules: ArrayList<TicketsSDKModule> = ArrayList()
        modules.add(getCustomModule(context))

        if (Config.get("moreTicketActionsModule") == "true") {
          modules.add(MoreTicketActionsModule(order.eventId))
        }

        if (Config.get("venueDirectionsModule") == "true") {
          getDirectionsModule(order.orderInfo.latLng)?.let { module ->
            modules.add(module)
          }
        }

        val seatUpgradesModuleTextOverride = ModuleBase.TextOverride(
          text = Config.optionalString("seatUpgradesModuleTopLabelText") ?: "Seat Upgrades",
          orientation = ModuleBase.TextOverride.Orientation.LEFT
        )

        if (Config.get("seatUpgradesModule") == "true") {
          val firstTicketSource = order.source
          if (firstTicketSource != null) {
            modules.add(
              SeatUpgradesModule(
                webPageSettings = NAMWebPageSettings(context, firstTicketSource),
                imageOverride = getImageOverride("seatUpgradesModuleImage"),
                textOverride = seatUpgradesModuleTextOverride,
                eventId = order.eventId,
              ).build(context)
            )
          }
        }

        val venueConcessionsModuleTextOverride = VenueNextModule.VenueNextTextOverride(
          food = Config.optionalString("venueConcessionsModuleTopLabelText")?.let {
            ModuleBase.TextOverride(it)
          },
          merch = when (Config.optionalString("venueConcessionsModuleTopLabelText")) {
            null -> null
            "" -> ModuleBase.TextOverride("")
            else -> ModuleBase.TextOverride("")
          },
          experiences = when (Config.optionalString("venueConcessionsModuleTopLabelText")) {
            null -> null
            "" -> ModuleBase.TextOverride("")
            else -> ModuleBase.TextOverride("")
          },
          fingertips = Config.optionalString("venueConcessionsModuleBottomLabelText")?.let {
            ModuleBase.TextOverride(it)
          }
        )

        if (Config.get("venueConcessionsModule") == "true") {
          val venueNextModule = VenueNextModule.Builder(order.venueId).build()
          modules.add(
            venueNextModule.createVenueNextView(
              context,
              textOverride = venueConcessionsModuleTextOverride,
              imageOverride = getImageOverride("venueConcessionsModuleImage")
            ) {}
          )
        }

        if (Config.get("invoiceModule") == "true") {
          modules.add(InvoiceModule())
        }

        return MutableLiveData(modules)
      }

      override fun userDidPressActionButton(
        buttonTitle: String?,
        callbackValue: String?,
        eventOrders: EventOrders?
      ) {
        when (buttonTitle) {
          Config.get("button1Title") -> {
            val params: WritableMap = Arguments.createMap()
            val paramValues: WritableMap = Arguments.createMap().apply {
              putString("eventOrderInfo", eventOrders.toString())
            }
            params.putMap("ticketsSdkCustomModuleButton1", paramValues)
            GlobalEventEmitter.sendEvent("igniteAnalytics", params)
          }
          Config.get("button2Title") -> {
            val params: WritableMap = Arguments.createMap()
            val paramValues: WritableMap = Arguments.createMap().apply {
              putString("eventOrderInfo", eventOrders.toString())
            }
            params.putMap("ticketsSdkCustomModuleButton2", paramValues)
            GlobalEventEmitter.sendEvent("igniteAnalytics", params)
          }
          Config.get("button3Title") -> {
            val params: WritableMap = Arguments.createMap()
            val paramValues: WritableMap = Arguments.createMap().apply {
              putString("eventOrderInfo", eventOrders.toString())
            }
            params.putMap("ticketsSdkCustomModuleButton3", paramValues)
            GlobalEventEmitter.sendEvent("igniteAnalytics", params)
          }
          "Order" -> {
            val params: WritableMap = Arguments.createMap()
            val paramValues: WritableMap = Arguments.createMap().apply {
              putString("eventOrderInfo", eventOrders.toString())
            }
            params.putMap("ticketsSdkVenueConcessionsOrderFor", paramValues)
            GlobalEventEmitter.sendEvent("igniteAnalytics", params)
          }
          "Wallet" -> {
            val params: WritableMap = Arguments.createMap()
            val paramValues: WritableMap = Arguments.createMap().apply {
              putString("eventOrderInfo", eventOrders.toString())
            }
            params.putMap("ticketsSdkVenueConcessionsWalletFor", paramValues)
            GlobalEventEmitter.sendEvent("igniteAnalytics", params)
          }
        }
      }
    }
  }

  private fun getDirectionsModule(latLng: TicketsModuleDelegate.LatLng?): ModuleBase? {
    val latitude = latLng?.latitude ?: return null
    val longitude = latLng.longitude ?: return null
    val activity = getFragmentActivity() ?: return null
    return DirectionsModule(activity, latitude, longitude).build()
  }

  private fun setupTicketsSDK() {
    ioScope.launch {
      try {
        val authenticationResult =
          TMAuthentication.Builder(Config.get("apiKey"), Config.get("clientName"))
            .colors(createAuthColors(Config.get("primaryColor").toColorInt()))
            .environment(Environment.getTMXDeploymentEnvironment(Config.get("environment")))
            .region(Region.getRegion())
            .build(context)

        val authentication = authenticationResult.getOrThrow()
        val tokenMap = validateAuthToken(authentication)

        mainScope.launch {
          TicketsSDKClient
            .Builder(createTicketsColorScheme(Config.get("primaryColor").toColorInt()))
            .authenticationSDKClient(authentication)
            .build(context)
            .apply {
              TicketsSDKSingleton.setTicketsSdkClient(this)
              TicketsSDKSingleton.setEnvironment(
                context,
                Environment.getTicketsSDKSingletonEnvironment(Config.get("environment")),
                Region.getTicketsSDKRegion()
              )

              // Wait for view to be measured before launching fragment
              if (isViewReady()) {
                launchTickets(tokenMap)
              } else {
                viewTreeObserver.addOnGlobalLayoutListener(object : ViewTreeObserver.OnGlobalLayoutListener {
                  override fun onGlobalLayout() {
                    if (isViewReady()) {
                      viewTreeObserver.removeOnGlobalLayoutListener(this)
                      launchTickets(tokenMap)
                    }
                  }
                })
              }
            }
        }
      } catch (e: Exception) {
        Log.e("TicketsSdkView", "Failed to setup Tickets SDK", e)
      }
    }
  }

  private fun launchTickets(tokenMap: Map<AuthSource, String>) {
    if (tokenMap.isNotEmpty()) {
      val params: WritableMap = Arguments.createMap().apply {
        putString("ticketsSdkDidViewEvents", "ticketsSdkDidViewEvents")
      }
      GlobalEventEmitter.sendEvent("igniteAnalytics", params)
    }
    setCustomModules()
    launchTicketsView()
  }

}
