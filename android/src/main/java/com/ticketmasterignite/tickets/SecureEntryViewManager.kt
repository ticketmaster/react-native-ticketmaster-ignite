package com.ticketmasterignite.tickets

import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewManagerDelegate
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.viewmanagers.SecureEntryViewManagerDelegate
import com.facebook.react.viewmanagers.SecureEntryViewManagerInterface

@ReactModule(name = SecureEntryViewManager.NAME)
class SecureEntryViewManager :
  SimpleViewManager<SecureEntryView>(),
  SecureEntryViewManagerInterface<SecureEntryView> {

  private val delegate: ViewManagerDelegate<SecureEntryView> =
    SecureEntryViewManagerDelegate(this)

  override fun getDelegate(): ViewManagerDelegate<SecureEntryView> = delegate

  override fun getName(): String = NAME

  override fun createViewInstance(context: ThemedReactContext): SecureEntryView {
    return SecureEntryView(context)
  }

  @ReactProp(name = "token")
  override fun setToken(view: SecureEntryView, value: String?) {
    value?.let { view.setToken(it) }
  }

  @ReactProp(name = "offsetTop")
  override fun setOffsetTop(view: SecureEntryView, value: Double) {
    view.setOffsetTop(value.toInt())
  }

  companion object {
    const val NAME = "SecureEntryView"
  }
}
