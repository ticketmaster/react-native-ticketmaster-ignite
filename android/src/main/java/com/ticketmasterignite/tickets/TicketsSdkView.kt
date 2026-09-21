package com.ticketmasterignite.tickets

import android.content.Context
import android.graphics.BitmapFactory
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.view.ViewTreeObserver
import android.widget.FrameLayout
import android.widget.ImageView
import java.net.URL
import org.json.JSONArray
import kotlinx.coroutines.withContext
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
  private var deepLinkId: String? = null
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

  fun setDeepLinkId(id: String?) {
    deepLinkId = id
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

    if (!deepLinkId.isNullOrBlank()) {
      TicketsSDKSingleton.jumpToOrderOrEvent(context, deepLinkId!!)
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

  private data class CustomModuleButtonConfig(
    val title: String,
    val dismissTicketViewIos: Boolean
  )

  private data class CustomModuleConfig(
    val headerType: String,
    val headerColor: String,
    val buttons: List<CustomModuleButtonConfig>
  )

  // Mirrors the JSON written by IgniteProvider under the "customModules" config key
  private fun customModuleConfigs(): List<CustomModuleConfig> {
    val customModulesJson = Config.get("customModules")
    if (customModulesJson.isEmpty()) return emptyList()

    return runCatching {
      val modulesArray = JSONArray(customModulesJson)
      List(modulesArray.length()) { moduleIndex ->
        val moduleJson = modulesArray.getJSONObject(moduleIndex)
        val buttonsArray = moduleJson.getJSONArray("buttons")
        CustomModuleConfig(
          headerType = moduleJson.optString("headerType"),
          headerColor = moduleJson.optString("headerColor"),
          buttons = List(buttonsArray.length()) { buttonIndex ->
            val buttonJson = buttonsArray.getJSONObject(buttonIndex)
            CustomModuleButtonConfig(
              title = buttonJson.getString("title"),
              dismissTicketViewIos = buttonJson.optBoolean("dismissTicketViewIos", true)
            )
          }
        )
      }
    }.getOrElse { error ->
      Log.e("TicketsSdkView", "Failed to parse customModules config", error)
      emptyList()
    }
  }

  private fun customModuleId(moduleIndex: Int): String {
    return "com.${Config.get("clientName")}.$moduleIndex"
  }

  private fun getCustomModule(
    context: Context,
    config: CustomModuleConfig,
    moduleIndex: Int
  ): ModuleBase {
    val moduleBase = ModuleBase(context, customModuleId(moduleIndex))

    applyCustomModuleHeader(context, moduleBase, config, moduleIndex)

    config.buttons.getOrNull(0)?.let { moduleBase.setLeftButtonText(it.title) }
    config.buttons.getOrNull(1)?.let { moduleBase.setMiddleButtonText(it.title) }
    config.buttons.getOrNull(2)?.let { moduleBase.setRightButtonText(it.title) }

    // Empty listeners needed for button clicks to trigger callbacks
    moduleBase.setLeftClickListener {}
    moduleBase.setMiddleClickListener {}
    moduleBase.setRightClickListener {}

    return moduleBase
  }

  private fun applyCustomModuleHeader(
    context: Context,
    moduleBase: ModuleBase,
    config: CustomModuleConfig,
    moduleIndex: Int
  ) {
    when (config.headerType) {
      "color" -> {
        val color = runCatching { config.headerColor.toColorInt() }.getOrNull() ?: return
        val view = View(context).apply {
          setBackgroundColor(color)
          layoutParams = ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            (resources.displayMetrics.density * 120).toInt()
          )
        }
        moduleBase.setHeader(view)
      }
      "image" -> {
        val imageUri = Config.getImage("customModule${moduleIndex}HeaderImage") ?: return
        val imageView = ImageView(context).apply {
          scaleType = ImageView.ScaleType.CENTER_CROP
          layoutParams = ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
          )
        }
        moduleBase.setHeader(imageView)
        loadHeaderImage(imageUri, imageView)
      }
    }
  }

  private fun loadHeaderImage(imageUri: String, target: ImageView) {
    if (imageUri.startsWith("http")) {
      ioScope.launch {
        val bitmap = runCatching {
          URL(imageUri).openStream().use { BitmapFactory.decodeStream(it) }
        }.getOrNull()
        if (bitmap != null) {
          withContext(Dispatchers.Main) { target.setImageBitmap(bitmap) }
        }
      }
    } else {
      val resourceName = imageUri.substringAfterLast('/').substringBeforeLast('.')
      val resourceId = context.resources?.getIdentifier(resourceName, "drawable", context.packageName)
      if (resourceId != null && resourceId != 0) {
        target.setImageResource(resourceId)
      }
    }
  }

  // ModuleBase reports presses by slot name rather than index
  private fun customModuleButtonIndex(callbackValue: String?): Int? {
    return when (callbackValue) {
      "LeftClick" -> 0
      "MiddleButton" -> 1
      "RightClick" -> 2
      else -> null
    }
  }

  private fun emitCustomModuleButtonPressed(
    moduleId: String,
    moduleIndex: Int,
    buttonIndex: Int,
    buttonTitle: String?,
    eventOrders: EventOrders?
  ) {
    val params: WritableMap = Arguments.createMap()
    val paramValues: WritableMap = Arguments.createMap().apply {
      putString("moduleId", moduleId)
      putInt("moduleIndex", moduleIndex)
      putInt("buttonIndex", buttonIndex)
      putString("buttonTitle", buttonTitle ?: "")
      putString("eventOrderInfo", eventOrders.toString())
    }
    params.putMap("ticketsSdkCustomModuleButtonPressed", paramValues)
    GlobalEventEmitter.sendEvent("igniteAnalytics", params)
  }

  private fun emitTicketsSdkEvent(eventName: String, eventOrders: EventOrders?) {
    val params: WritableMap = Arguments.createMap()
    val paramValues: WritableMap = Arguments.createMap().apply {
      putString("eventOrderInfo", eventOrders.toString())
    }
    params.putMap(eventName, paramValues)
    GlobalEventEmitter.sendEvent("igniteAnalytics", params)
  }

  private fun handleActionButtonPress(
    moduleId: String?,
    buttonTitle: String?,
    callbackValue: String?,
    eventOrders: EventOrders?
  ) {
    val customModules = customModuleConfigs()
    val moduleIndex = if (moduleId != null) {
      customModules.indices.firstOrNull { customModuleId(it) == moduleId } ?: -1
    } else {
      // The legacy delegate overload carries no moduleId, so fall back to matching the button title
      customModules.indexOfFirst { config -> config.buttons.any { it.title == buttonTitle } }
    }

    if (moduleIndex >= 0) {
      val buttons = customModules[moduleIndex].buttons
      val buttonIndex = customModuleButtonIndex(callbackValue)
        ?.takeIf { it < buttons.size }
        ?: buttons.indexOfFirst { it.title == buttonTitle }
      if (buttonIndex >= 0) {
        emitCustomModuleButtonPressed(
          customModuleId(moduleIndex),
          moduleIndex,
          buttonIndex,
          buttonTitle,
          eventOrders
        )
      }
      return
    }

    when (buttonTitle) {
      "Order" -> emitTicketsSdkEvent("ticketsSdkVenueConcessionsOrderFor", eventOrders)
      "Wallet" -> emitTicketsSdkEvent("ticketsSdkVenueConcessionsWalletFor", eventOrders)
    }
  }

  private fun setCustomModules() {
    TicketsSDKSingleton.moduleDelegate = object : TicketsModuleDelegate {
      override fun getCustomModulesLiveData(order: TicketsModuleDelegate.Order): LiveData<List<TicketsSDKModule>> {
        val modules: ArrayList<TicketsSDKModule> = ArrayList()
        customModuleConfigs().forEachIndexed { moduleIndex, config ->
          modules.add(getCustomModule(context, config, moduleIndex))
        }

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
        handleActionButtonPress(null, buttonTitle, callbackValue, eventOrders)
      }

      override fun userDidPressActionButton(
        moduleId: String?,
        buttonTitle: String?,
        callbackValue: String?,
        eventOrders: EventOrders?
      ) {
        handleActionButtonPress(moduleId, buttonTitle, callbackValue, eventOrders)
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
          val ticketsClient = TicketsSDKClient
            .Builder(createTicketsColorScheme(Config.get("primaryColor").toColorInt()))
            .authenticationSDKClient(authentication)
            .build(context)

          ticketsClient.apply {
              TicketsSDKSingleton.setTicketsSdkClient(this)
              TicketsSDKSingleton.setEnvironment(
                context,
                Environment.getTicketsSDKSingletonEnvironment(Config.get("environment")),
                Region.getTicketsSDKRegion()
              )

              // Observe analytics events from the Tickets SDK using Flow
              mainScope.launch {
                com.ticketmaster.tickets.eventanalytic.UserAnalyticsDelegate.handler.getFlow().collect { analyticsData ->
                  analyticsData?.let { data ->
                    val detailsMap = mutableMapOf<String, Any>()
                    data.data?.let { bundle ->
                      bundle.keySet().forEach { key ->
                        bundle.get(key)?.let { value -> detailsMap[key] = value }
                      }
                    }
                    TicketsUserAnalyticsListener.handleAnalyticsEvent(data.actionName, detailsMap)
                  }
                }
              }

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
    setCustomModules()
    launchTicketsView()
  }

}
