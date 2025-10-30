package com.ticketmasterignite.tickets

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.ticketmaster.presence.SecureEntryView
import com.ticketmasterignite.R

class SecureEntryFragment : Fragment() {
  private var secureEntryView: SecureEntryView? = null
  override fun onCreateView(
    inflater: LayoutInflater, container: ViewGroup?,
    savedInstanceState: Bundle?
  ): View? {
    val view = inflater.inflate(R.layout.fragment_secure_entry_view, container, false)
    secureEntryView = view.findViewById(R.id.secure_entry_view)
    return view
  }

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)
    val token = arguments?.getString("token") ?: ""
    secureEntryView?.setToken(token)
  }
}

private fun SecureEntryView?.setToken(token: String) {}
