package com.ticketmasterignite.tickets

import android.view.Choreographer
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.uimanager.annotations.ReactPropGroup

class TicketsViewManager (
  private val reactContext: ReactApplicationContext
) : ViewGroupManager<FrameLayout>() {
  private var propWidth: Int = 0
  private var propHeight: Int = 0
  private var propOffsetTop: Int = 0

  override fun getName() = REACT_CLASS

  /**
   * Return a FrameLayout which will later hold the Fragment
   */
  override fun createViewInstance(reactContext: ThemedReactContext) =
    FrameLayout(reactContext)

  /**
   * Map the "create" command to an integer
   */
  override fun getCommandsMap() = mapOf("create" to COMMAND_CREATE)

  /**
   * Handle "create" command (called from JS) and call createFragment method
   */
  override fun receiveCommand(
    root: FrameLayout,
    commandId: Int,
    args: ReadableArray?
  ) {
    when (commandId) {
      COMMAND_CREATE -> {
        val reactNativeViewId = args?.getInt(0) ?: return
        createFragment(root, reactNativeViewId)
      }
    }
  }

  @ReactPropGroup(names = ["width", "height"], customType = "Style")
  fun setStyle(view: FrameLayout, index: Int, value: Int) {
    if (index == 0) propWidth = value
    if (index == 1) propHeight = value
  }

  @ReactProp(name = "offsetTop")
  fun setOffsetTop(view: FrameLayout, offsetTop: Int) {
    if (offsetTop != 0) {
      propOffsetTop = offsetTop
    }
  }

  /**
   * Replace your React Native view with a custom fragment
   */
  fun createFragment(root: FrameLayout, reactNativeViewId: Int) {
    val parentView = root.findViewById<ViewGroup>(reactNativeViewId)
    setupLayout(parentView)

    val ticketsFragment = TicketsFragment()
    val activity = reactContext.currentActivity as FragmentActivity
    activity.supportFragmentManager
      .beginTransaction()
      .replace(reactNativeViewId, ticketsFragment, reactNativeViewId.toString())
      .commit()
  }

  fun setupLayout(view: View) {
    Choreographer.getInstance().postFrameCallback(object: Choreographer.FrameCallback {
      override fun doFrame(frameTimeNanos: Long) {
        manuallyLayoutChildren(view)
        view.viewTreeObserver.dispatchOnGlobalLayout()
        Choreographer.getInstance().postFrameCallback(this)
      }
    })
  }

  /**
   * Layout all children properly
   */
  private fun manuallyLayoutChildren(view: View) {
      view.measure(
        View.MeasureSpec.makeMeasureSpec(propWidth, View.MeasureSpec.EXACTLY),
        View.MeasureSpec.makeMeasureSpec(propHeight, View.MeasureSpec.EXACTLY))

      view.layout(0, 0, propWidth, propHeight)
      view.offsetTopAndBottom(propOffsetTop)
  }

  companion object {
    private const val REACT_CLASS = "TicketsViewManager"
    private const val COMMAND_CREATE = 1
  }
}
