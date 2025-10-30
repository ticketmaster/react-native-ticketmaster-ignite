package com.ticketmasterignite.tickets

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.ui.graphics.Color
import androidx.fragment.app.Fragment
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.ticketmasterignite.R
import com.ticketmaster.authenticationsdk.AuthSource
import com.ticketmaster.authenticationsdk.TMAuthentication
import com.ticketmaster.tickets.EventOrders
import com.ticketmaster.tickets.TicketsModuleDelegate
import com.ticketmaster.tickets.event_tickets.DirectionsModule
import com.ticketmaster.tickets.event_tickets.InvoiceModule
import com.ticketmaster.tickets.event_tickets.ModuleBase
import com.ticketmaster.tickets.event_tickets.SeatUpgradesModule
import com.ticketmaster.tickets.event_tickets.MoreTicketActionsModule
import com.ticketmaster.tickets.event_tickets.NAMWebPageSettings
import com.ticketmaster.tickets.event_tickets.TicketsSDKModule
import com.ticketmaster.tickets.ticketssdk.TicketsColors
import com.ticketmaster.tickets.ticketssdk.TicketsSDKClient
import com.ticketmaster.tickets.ticketssdk.TicketsSDKSingleton
import com.ticketmaster.tickets.venuenext.VenueNextModule
import com.ticketmasterignite.Environment
import com.ticketmasterignite.GlobalEventEmitter
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.json.JSONObject
import androidx.core.graphics.toColorInt

class TicketsFragment() : Fragment() {
  private lateinit var customView: TicketsView

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

  private fun launchTicketsView() {
    TicketsSDKSingleton.getEventsFragment(requireContext())?.let {
      childFragmentManager.beginTransaction().add(R.id.tickets_container, it).commit()
    }

    if (Config.get("orderIdDeepLink").isNotBlank()) {
      TicketsSDKSingleton.jumpToOrderOrEvent(requireContext(), Config.get("orderIdDeepLink"))
      Config.set("orderIdDeepLink", "")
    }
  }

  private val resultLauncher = registerForActivityResult(
    ActivityResultContracts.StartActivityForResult()
  ) { result ->
    when (result.resultCode) {
      AppCompatActivity.RESULT_OK -> {
        val params: WritableMap = Arguments.createMap().apply {
          putString("ticketsSdkDidViewEvents", "ticketsSdkDidViewEvents")
        }
        GlobalEventEmitter.sendEvent("igniteAnalytics", params)
        launchTicketsView()
        setCustomModules()
      }

      AppCompatActivity.RESULT_CANCELED -> {
      }
    }
  }

  private fun getImageOverride(imageName: String): ModuleBase.ImageOverride? {
    return Config.getImage(imageName)?.let { imageJsonString ->
      val resolvedImage = JSONObject(imageJsonString)
      val uri = resolvedImage.optString("uri")
      val isPackagerAsset = resolvedImage.optBoolean("__packager_asset", false)

      when {
        uri.contains("10.0.") -> {
          println("Loading image in the debug mode")
          ModuleBase.ImageOverride(url = uri)
        }

        isPackagerAsset && uri.isNotEmpty() -> {
          println("Loading image in the release mode")
          val resourceName = uri.substringAfterLast('/').substringBeforeLast('.')
          val resourceId =
            context?.resources?.getIdentifier(resourceName, "drawable", context?.packageName)

          if (resourceId != null && resourceId != 0) {
            ModuleBase.ImageOverride(src = resourceId)
          } else {
            println("Resource not found: $resourceName")
            null
          }
        }

        else -> null
      }
    }
  }

  private fun setCustomModules() {
    TicketsSDKSingleton.moduleDelegate = object : TicketsModuleDelegate {
      override fun getCustomModulesLiveData(order: TicketsModuleDelegate.Order): LiveData<List<TicketsSDKModule>> {
        val modules: ArrayList<TicketsSDKModule> = ArrayList()

        if (Config.get("moreTicketActionsModule") == "true") {
          modules.add(MoreTicketActionsModule(order.eventId))
        }

        if (Config.get("venueDirectionsModule") == "true") {
          modules.add(getDirectionsModule(order.orderInfo.latLng))
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
                webPageSettings = NAMWebPageSettings(
                  requireContext(),
                  firstTicketSource
                ),
                imageOverride = getImageOverride("seatUpgradesModuleImage"),
                textOverride = seatUpgradesModuleTextOverride,
                eventId = order.eventId,
              ).build(requireContext())
            )
          }
        }

        val venueConcessionsModuleTextOverride = VenueNextModule.VenueNextTextOverride(
          food = Config.optionalString("venueConcessionsModuleTopLabelText")?.let {
            ModuleBase.TextOverride(it)
          },
          // POTENTIAL REFACTOR
//          merch = Config.optionalString("venueConcessionsModuleTopLabelText")?.let {
//            ModuleBase.TextOverride(it)
//          } ?: null,
//          experiences = Config.optionalString("venueConcessionsModuleTopLabelText")?.let {
//            ModuleBase.TextOverride(it)
//          } ?: null,
          merch = when (val text = Config.optionalString("venueConcessionsModuleTopLabelText")) {
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
              requireContext(),
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
        if (buttonTitle == "Order") {
          val params: WritableMap = Arguments.createMap()
          val paramValues: WritableMap = Arguments.createMap().apply {
            putString("eventOrderInfo", eventOrders.toString())
          }
          params.putMap("ticketsSdkVenueConcessionsOrderFor", paramValues)

          GlobalEventEmitter.sendEvent("igniteAnalytics", params)
        }
        if (buttonTitle == "Wallet") {
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

  private fun getDirectionsModule(latLng: TicketsModuleDelegate.LatLng?): ModuleBase {
    return DirectionsModule(
      requireActivity(), latLng?.latitude!!, latLng.longitude
    ).build()
  }

  override fun onAttach(context: Context) {
    super.onAttach(context)
    val coroutineScope = CoroutineScope(Dispatchers.IO)
    coroutineScope.launch(Dispatchers.Main) {
      val authenticationResult =
        TMAuthentication.Builder(Config.get("apiKey"), Config.get("clientName"))
          .colors(createAuthColors(Config.get("primaryColor").toColorInt()))
          .environment(Environment.getTMXDeploymentEnvironment(Config.get("environment")))
          .region(Region.getRegion())
          .build(requireContext())

      val authentication = authenticationResult.getOrThrow()
      val tokenMap = validateAuthToken(authentication)

      TicketsSDKClient
        .Builder()
        .authenticationSDKClient(authentication)
        .colors(createTicketsColors(Config.get("primaryColor").toColorInt()))
        .build(requireContext())
        .apply {
          TicketsSDKSingleton.setTicketsSdkClient(this)
          TicketsSDKSingleton.setEnvironment(
            requireContext(),
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
            resultLauncher.launch(TicketsSDKSingleton.getLoginIntent(requireActivity()))
          }
        }
    }
  }

  override fun onCreateView(
    inflater: LayoutInflater, container: ViewGroup?,
    savedInstanceState: Bundle?
  ): View {
    customView = TicketsView(requireNotNull(context))
    return customView
  }
}
