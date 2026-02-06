package com.ticketmasterignite.tickets

import android.content.Context
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
import com.ticketmaster.tickets.ticketssdk.TicketsColors
import com.ticketmaster.tickets.ticketssdk.TicketsSDKClient
import com.ticketmaster.tickets.ticketssdk.TicketsSDKSingleton
import com.ticketmaster.tickets.venuenext.VenueNextModule
import com.ticketmasterignite.Environment
import com.ticketmasterignite.GlobalEventEmitter
import com.ticketmasterignite.R
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class TicketsSdkView(context: Context) : FrameLayout(context) {

  private var offsetTop: Int = 0

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

  private fun createTicketsColors(color: Int): TicketsColors =
    TicketsColors(
      lightColorScheme(primary = Color(color), secondary = Color(color)),
      darkColorScheme(primary = Color(color), secondary = Color(color))
    )

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
    TicketsSDKSingleton.getEventsFragment(context)?.let { fragment ->
      val activity = getFragmentActivity()
      activity?.supportFragmentManager?.beginTransaction()
        ?.add(R.id.tickets_container, fragment)
        ?.commitAllowingStateLoss()
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
          val firstTicketSource = order.tickets.firstOrNull()?.source
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
    val coroutineScope = CoroutineScope(Dispatchers.IO)
    coroutineScope.launch(Dispatchers.Main) {
      val authenticationResult =
        TMAuthentication.Builder(Config.get("apiKey"), Config.get("clientName"))
          .colors(createAuthColors(Config.get("primaryColor").toColorInt()))
          .environment(Environment.getTMXDeploymentEnvironment(Config.get("environment")))
          .region(Region.getRegion())
          .build(context)

      val authentication = authenticationResult.getOrThrow()
      val tokenMap = validateAuthToken(authentication)

      TicketsSDKClient
        .Builder()
        .authenticationSDKClient(authentication)
        .colors(createTicketsColors(Config.get("primaryColor").toColorInt()))
        .build(context)
        .apply {
          TicketsSDKSingleton.setTicketsSdkClient(this)
          TicketsSDKSingleton.setEnvironment(
            context,
            Environment.getTicketsSDKSingletonEnvironment(Config.get("environment")),
            Region.getTicketsSDKRegion()
          )
          if (tokenMap.isNotEmpty()) {
            val params: WritableMap = Arguments.createMap().apply {
              putString("ticketsSdkDidViewEvents", "ticketsSdkDidViewEvents")
            }
            GlobalEventEmitter.sendEvent("igniteAnalytics", params)
            launchTicketsView()
            setCustomModules()
          } else {
            launchTicketsView()
            setCustomModules()
          }
        }
    }
  }
}
