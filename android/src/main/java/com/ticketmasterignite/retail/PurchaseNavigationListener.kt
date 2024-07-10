package com.ticketmasterignite.retail

import com.ticketmaster.purchase.listener.TMPurchaseNavigationListener

class PurchaseNavigationListener(private val closeScreen: () -> Unit) :
        TMPurchaseNavigationListener {
    override fun errorOnEventDetailsPage(error: Exception) {}

    override fun onPurchaseClosed() {
        closeScreen.invoke()
    }

}