package com.ticketmasterignite.tickets

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.ticketmasterignite.GlobalEventEmitter

object TicketsUserAnalyticsListener {

  fun handleAnalyticsEvent(action: String, details: Map<String, Any>) {
    val eventName = "igniteAnalytics"
    val params: WritableMap = Arguments.createMap()

    when (action) {
      // Page view events
      "com.ticketmaster.presencesdk.eventanalytic.action.MYTICKETSCREENSHOWED" -> {
        params.putString("ticketsSdkDidViewEvents", "ticketsSdkDidViewEvents")
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.MANAGETICKETSCREENSHOWED" -> {
        val paramValues: WritableMap = Arguments.createMap().apply {
          putString("eventId", details["event_id"]?.toString() ?: "")
          putString("eventName", details["event_name"]?.toString() ?: "")
          putInt("ticketCount", (details["current_ticket_count"] as? Number)?.toInt() ?: 0)
        }
        params.putMap("ticketsSdkDidViewEventTickets", paramValues)
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.MYTICKETBARCODESCREENSHOWED" -> {
        val paramValues: WritableMap = Arguments.createMap().apply {
          putString("eventId", details["event_id"]?.toString() ?: "")
          putString("eventName", details["event_name"]?.toString() ?: "")
          putString("section", details["section"]?.toString() ?: "")
          putString("row", details["row"]?.toString() ?: "")
          putString("seat", details["seat"]?.toString() ?: "")
        }
        params.putMap("ticketsSdkDidViewTicketBarcode", paramValues)
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.TICKETDETAILSSCREENSHOWED" -> {
        val paramValues: WritableMap = Arguments.createMap().apply {
          putString("eventId", details["event_id"]?.toString() ?: "")
          putString("eventName", details["event_name"]?.toString() ?: "")
          putString("section", details["section"]?.toString() ?: "")
          putString("row", details["row"]?.toString() ?: "")
          putString("seat", details["seat"]?.toString() ?: "")
        }
        params.putMap("ticketsSdkDidViewTicketDetails", paramValues)
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.MFA_FOR_TICKET_OPERATION" -> {
        params.putString("ticketsSdkDidViewMfaForTicketOperation", "ticketsSdkDidViewMfaForTicketOperation")
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.MFA_FOR_VIEW_BARCODE" -> {
        params.putString("ticketsSdkDidViewMfaForViewBarcode", "ticketsSdkDidViewMfaForViewBarcode")
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.MFA_FOR_WEBPAGE" -> {
        params.putString("ticketsSdkDidViewMfaForWebpage", "ticketsSdkDidViewMfaForWebpage")
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.ADDPAYMENTINFOSCREENSHOWED" -> {
        params.putString("ticketsSdkDidViewAddPaymentInfo", "ticketsSdkDidViewAddPaymentInfo")
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.REVIEWPOSTINGSCREENSHOWED" -> {
        params.putString("ticketsSdkDidViewReviewPosting", "ticketsSdkDidViewReviewPosting")
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.POSTINGCONFIRMATIONSCREENSHOWED" -> {
        params.putString("ticketsSdkDidViewPostingConfirmation", "ticketsSdkDidViewPostingConfirmation")
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.CANCELPOSTINGSCREENSHOWED" -> {
        params.putString("ticketsSdkDidViewCancelPosting", "ticketsSdkDidViewCancelPosting")
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.CANCELPOSTINGCONFIRMSCREENSHOWED" -> {
        params.putString("ticketsSdkDidViewCancelPostingConfirm", "ticketsSdkDidViewCancelPostingConfirm")
      }

      // User action events
      "com.ticketmaster.presencesdk.eventanalytic.action.ACTION_ADD_TO_WALLET_INITIATE" -> {
        val paramValues: WritableMap = Arguments.createMap().apply {
          putString("eventId", details["event_id"]?.toString() ?: "")
          putString("eventName", details["event_name"]?.toString() ?: "")
          putString("section", details["section"]?.toString() ?: "")
          putString("row", details["row"]?.toString() ?: "")
          putString("seat", details["seat"]?.toString() ?: "")
        }
        params.putMap("ticketsSdkDidInitiateAddTicketToWallet", paramValues)
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.ACTION_TRANSFERINITIATED" -> {
        val paramValues: WritableMap = Arguments.createMap().apply {
          putString("eventId", details["event_id"]?.toString() ?: "")
          putString("eventName", details["event_name"]?.toString() ?: "")
          putInt("ticketCount", (details["initiate_transfer_ticket_count"] as? Number)?.toInt() ?: 0)
          putString("faceValue", details["initiate_transfer_ticket_facevalue"]?.toString() ?: "")
        }
        params.putMap("ticketsSdkDidInitiateTransfer", paramValues)
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.ACTION_TRANSFERCANCELLED" -> {
        val paramValues: WritableMap = Arguments.createMap().apply {
          putString("eventId", details["event_id"]?.toString() ?: "")
          putString("eventName", details["event_name"]?.toString() ?: "")
          putString("transferId", details["cancel_transfer_id"]?.toString() ?: "")
          putString("orderId", details["cancel_transfer_order_id"]?.toString() ?: "")
        }
        params.putMap("ticketsSdkDidCancelTransfer", paramValues)
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.ACTION_RESALECANCELLED" -> {
        val paramValues: WritableMap = Arguments.createMap().apply {
          putString("eventId", details["event_id"]?.toString() ?: "")
          putString("eventName", details["event_name"]?.toString() ?: "")
          putString("postingId", details["cancel_resale_posting_id"]?.toString() ?: "")
        }
        params.putMap("ticketsSdkDidCancelResale", paramValues)
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.ACTION_BARCODE_SCREENSHOT" -> {
        val paramValues: WritableMap = Arguments.createMap().apply {
          putString("eventId", details["event_id"]?.toString() ?: "")
          putString("eventName", details["event_name"]?.toString() ?: "")
          putString("section", details["section"]?.toString() ?: "")
          putString("row", details["row"]?.toString() ?: "")
          putString("seat", details["seat"]?.toString() ?: "")
        }
        params.putMap("ticketsSdkDidTakeBarcodeScreenshot", paramValues)
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.ACTION_PULL_TO_REFRESH_EVENTS" -> {
        val paramValues: WritableMap = Arguments.createMap().apply {
          putInt("eventCount", (details["current_ticket_count"] as? Number)?.toInt() ?: 0)
        }
        params.putMap("ticketsSdkDidPullToRefreshEvents", paramValues)
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.ACTION_TRANSFERACCEPTED" -> {
        val paramValues: WritableMap = Arguments.createMap().apply {
          putString("eventId", details["event_id"]?.toString() ?: "")
          putString("eventName", details["event_name"]?.toString() ?: "")
          putString("transferId", details["transfer_id"]?.toString() ?: "")
        }
        params.putMap("ticketsSdkDidAcceptTransfer", paramValues)
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.ACTION_SHARE_TRANSFER" -> {
        val paramValues: WritableMap = Arguments.createMap().apply {
          putString("eventId", details["event_id"]?.toString() ?: "")
          putString("eventName", details["event_name"]?.toString() ?: "")
        }
        params.putMap("ticketsSdkDidShareTransfer", paramValues)
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.ACTION_MY_TICKETS_HELP" -> {
        params.putString("ticketsSdkDidPressMyTicketsHelp", "ticketsSdkDidPressMyTicketsHelp")
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.ACTION_HEALTH_CHECK_MORE_INFO_CLICK" -> {
        params.putString("ticketsSdkDidPressHealthCheckMoreInfo", "ticketsSdkDidPressHealthCheckMoreInfo")
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.ACTION_HEALTH_CHECK_LEARN_MORE_CLICK" -> {
        params.putString("ticketsSdkDidPressHealthCheckLearnMore", "ticketsSdkDidPressHealthCheckLearnMore")
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.ACTION_HEALTH_CHECK_GOT_IT_CLICK" -> {
        params.putString("ticketsSdkDidPressHealthCheckGotIt", "ticketsSdkDidPressHealthCheckGotIt")
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.ACTION_GAME_DAY_MODAL_SHOWED" -> {
        params.putString("ticketsSdkDidViewGameDayModal", "ticketsSdkDidViewGameDayModal")
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.ACTION_GAME_DAY_FLOW_ACCEPTED" -> {
        params.putString("ticketsSdkDidAcceptGameDayFlow", "ticketsSdkDidAcceptGameDayFlow")
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.ACTION_GAME_DAY_FLOW_REJECTED" -> {
        params.putString("ticketsSdkDidRejectGameDayFlow", "ticketsSdkDidRejectGameDayFlow")
      }

      // Module events
      "FIRST MODULE VIEWED" -> {
        val paramValues: WritableMap = Arguments.createMap().apply {
          putString("moduleId", details["module_id"]?.toString() ?: "")
          putString("eventOrderInfo", details["event_orders"]?.toString() ?: "")
        }
        params.putMap("ticketsSdkDidViewFirstModule", paramValues)
      }

      // Federated login events (from Accounts SDK but delivered via same UserAnalyticsDelegate)
      "com.ticketmaster.presencesdk.eventanalytic.action.ACTION_FED_LOGIN_LINK_ACCOUNTS_SCREEN_SHOWED" -> {
        params.putString("accountsSdkFedLoginLinkAccountsScreenShowed", "accountsSdkFedLoginLinkAccountsScreenShowed")
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.ACTION_FED_LOGIN_LINK_ACCOUNTS_SCREEN_DISMISSED" -> {
        params.putString("accountsSdkFedLoginLinkAccountsScreenDismissed", "accountsSdkFedLoginLinkAccountsScreenDismissed")
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.ACTION_FED_LOGIN_SCREEN_DISMISSED_AFTER_SUCCESS_LOGIN_NO_LINK" -> {
        params.putString("accountsSdkFedLoginScreenDismissedAfterSuccessLoginNoLink", "accountsSdkFedLoginScreenDismissedAfterSuccessLoginNoLink")
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.ACTION_FED_LOGIN_LINK_ACCOUNTS_BUTTON_PRESSED" -> {
        params.putString("accountsSdkFedLoginLinkAccountsButtonPressed", "accountsSdkFedLoginLinkAccountsButtonPressed")
      }
      "com.ticketmaster.presencesdk.eventanalytic.action.ACTION_FED_LOGIN_NO_THANKS_BUTTON_PRESSED" -> {
        params.putString("accountsSdkFedLoginNoThanksButtonPressed", "accountsSdkFedLoginNoThanksButtonPressed")
      }
      else -> {
        // Handle "MODULE VIEWED: N" pattern
        if (action.startsWith("MODULE VIEWED: ")) {
          val moduleIndex = action.substring("MODULE VIEWED: ".length)
          val paramValues: WritableMap = Arguments.createMap().apply {
            putString("moduleIndex", moduleIndex)
            putString("moduleId", details["module_id"]?.toString() ?: "")
            putString("eventOrderInfo", details["event_orders"]?.toString() ?: "")
          }
          params.putMap("ticketsSdkDidViewModule", paramValues)
        } else {
          return
        }
      }
    }

    GlobalEventEmitter.sendEvent(eventName, params)
  }
}
