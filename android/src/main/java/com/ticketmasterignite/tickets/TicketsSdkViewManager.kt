package com.ticketmasterignite.tickets

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.TicketsSdkEmbeddedViewManagerDelegate
import com.facebook.react.viewmanagers.TicketsSdkEmbeddedViewManagerInterface

@ReactModule(name = TicketsSdkViewManager.NAME)
class TicketsSdkViewManager :
  SimpleViewManager<TicketsSdkView>(),
  TicketsSdkEmbeddedViewManagerInterface<TicketsSdkView> {

  private val delegate: ViewManagerDelegate<TicketsSdkView> =
    TicketsSdkEmbeddedViewManagerDelegate(this)

  override fun getDelegate(): ViewManagerDelegate<TicketsSdkView> = delegate

  override fun getName(): String = NAME

  override fun createViewInstance(context: ThemedReactContext): TicketsSdkView {
    return TicketsSdkView(context)
  }

  @ReactProp(name = "offsetTop")
  override fun setOffsetTop(view: TicketsSdkView, value: Double) {
    view.setOffsetTop(value.toInt())
  }

  companion object {
    const val NAME = "TicketsSdkEmbeddedView"
  }
}
