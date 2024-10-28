package com.ticketmasterignite.tickets

import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.compose.material.darkColors
import androidx.compose.material.lightColors
import androidx.compose.ui.graphics.Color
import androidx.fragment.app.Fragment
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.ticketmasterignite.R
import com.ticketmaster.authenticationsdk.AuthSource
import com.ticketmaster.authenticationsdk.TMAuthentication
import com.ticketmaster.authenticationsdk.TMXDeploymentEnvironment
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
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class TicketsFragment() : Fragment() {
    private lateinit var customView: TicketsView

    private fun createTicketsColors(color: Int): TicketsColors =
        TicketsColors(
            lightColors(primary = Color(color), primaryVariant = Color(color), secondary = Color(color)),
            darkColors(primary = Color(color), primaryVariant = Color(color), secondary = Color(color))
        )

    private fun createAuthColors(color: Int): TMAuthentication.ColorTheme =
        TMAuthentication.ColorTheme(
            lightColors(primary = Color(color), primaryVariant = Color(color), secondary = Color(color)),
            darkColors(primary = Color(color), primaryVariant = Color(color), secondary = Color(color))
        )

    private suspend fun validateAuthToken(authentication: TMAuthentication): Map<AuthSource, String> {
        val tokenMap = mutableMapOf<AuthSource, String>()
        AuthSource.values().forEach {
            //Validate if there is an active token for the AuthSource, if not it returns null.
            authentication.getToken(it)?.let { token ->
                tokenMap[it] = token
            }
        }
        return tokenMap
    }

    private fun launchTicketsView() {
        //Retrieve an EventFragment
        TicketsSDKSingleton.getEventsFragment(requireContext())?.let {
            childFragmentManager.beginTransaction().add(R.id.tickets_container, it).commit()
        }
    }

    private val resultLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        when (result.resultCode) {
            AppCompatActivity.RESULT_OK -> launchTicketsView()
            AppCompatActivity.RESULT_CANCELED -> {
            }
        }
    }

  private fun setCustomModules() {
    TicketsSDKSingleton.moduleDelegate = object : TicketsModuleDelegate {
      override fun getCustomModulesLiveData(order: TicketsModuleDelegate.Order): LiveData<List<TicketsSDKModule>> {
        // create a list of TicketsSDKModule type, all the modules created will be added to the list.
        val modules: ArrayList<TicketsSDKModule> = ArrayList()

        // show an Account Manager More Ticket Actions module
        // this is a standard "prebuilt" module that we provide to all our partners
        if (Config.get("moreTicketsActionsModule") == "true") {
          modules.add(MoreTicketActionsModule(order.eventId))
        }

        // show a street-map around the Venue with a Directions button that opens Google Maps
        // this is a standard "prebuilt" module that we provide to all our partners
        if (Config.get("venueDirectionsModule") == "true") {
          modules.add(getDirectionsModule(order.orderInfo.latLng))
        }

        // show an Account Manager Seat Upgrades module
        // this is a standard "prebuilt" module that we provide to all our partners
        if (Config.get("seatUpgradesModule") == "true") {
          val firstTicketSource = order.tickets.firstOrNull()?.source
          if (firstTicketSource != null) {
            modules.add(
              SeatUpgradesModule(
                context = context!!,
                webPageSettings = NAMWebPageSettings(
                  context!!,
                  firstTicketSource
                ),
                eventId = order.eventId
              ).build()
            )
          }
        }

        // show a Venue Concessions module
        // this is a standard "prebuilt" module that we provide to all our partners
        if (Config.get("venueConcessionsModule") == "true") {
          val venueNextModule = VenueNextModule.Builder(order.venueId).build()
          modules.add(venueNextModule.createVenueNextView(context!!) {
            //Venue next click event
          })
        }

        // show an Account Manager Invoice Actions module
        // this is a standard "prebuilt" module that we provide to all our partners
        if (Config.get("invoiceModule") == "true") {
          modules.add(InvoiceModule())
        }

        //Add the list to a LiveData object.
        return MutableLiveData(modules)
      }
      override fun userDidPressActionButton(buttonTitle: String?, callbackValue: String?, eventOrders: EventOrders?) {
        //buttonTitle: text inside the Material Button
        //callbackValue: LeftClick, MiddleButton or RightClick
        Log.d("userDidPressAction", eventOrders.toString())
      }
    }
  }


  private fun getDirectionsModule(
    latLng: TicketsModuleDelegate.LatLng?
  ): ModuleBase {
    return DirectionsModule(
      context as AppCompatActivity, latLng?.latitude, latLng?.longitude
    ).build()
  }

    override fun onAttach(context: Context) {
        super.onAttach(context)
        val coroutineScope = CoroutineScope(Dispatchers.IO)
        coroutineScope.launch(Dispatchers.Main) {
            val authentication = TMAuthentication.Builder()
                .apiKey(Config.get("apiKey"))
                .clientName(Config.get("clientName")) // Team name to be displayed
                .colors(createAuthColors(android.graphics.Color.parseColor(Config.get("primaryColor"))))
                .environment(TMXDeploymentEnvironment.Production) // Environment that the SDK will use. Default is Production
                .region(Region.getRegion()) // Region that the SDK will use. Default is US
                .forceNewSession(true)
                .build(this@TicketsFragment.requireActivity())
            val tokenMap = validateAuthToken(authentication)

            TicketsSDKClient
                .Builder()
                .authenticationSDKClient(authentication) //Authentication object
                //Optional value to define the colors for the Tickets page
                .colors(createTicketsColors(android.graphics.Color.parseColor(Config.get("primaryColor"))))
                //Function that generates a TicketsSDKClient object
                .build(this@TicketsFragment.requireActivity())
                .apply {
                    //After creating the TicketsSDKClient object, add it into the TicketsSDKSingleton
                    TicketsSDKSingleton.setTicketsSdkClient(this)
                    TicketsSDKSingleton.setEnvironment(
                      this@TicketsFragment.requireActivity(),
                      TicketsSDKSingleton.SDKEnvironment.Production,
                      Region.getTicketsSDKRegion());
                    //Validate if there is an active token.
                    if (tokenMap.isNotEmpty()) {
                        //If there is an active token, it launches the event fragment
                        launchTicketsView()
                        setCustomModules()
                    } else {
                        //If there is no active token, it launches a login intent. Launch an ActivityForResult, if result
                        //is RESULT_OK, there is an active token to be retrieved.
                        resultLauncher.launch(TicketsSDKSingleton.getLoginIntent(this@TicketsFragment.requireActivity()))
                    }
                }
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        customView = TicketsView(requireNotNull(context))
        return customView // this CustomView could be any view that you want to render

    }
}
