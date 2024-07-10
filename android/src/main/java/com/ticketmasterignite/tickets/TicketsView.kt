package com.ticketmasterignite.tickets

import android.content.Context
import android.widget.FrameLayout
import com.ticketmasterignite.R

class TicketsView(context: Context) : FrameLayout(context) {
    init {
        FrameLayout(context)
        addView(FrameLayout(context).apply { id = R.id.tickets_container })
    }
}