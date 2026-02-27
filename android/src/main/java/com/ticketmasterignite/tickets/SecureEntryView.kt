package com.ticketmasterignite.tickets

import android.content.Context
import android.view.LayoutInflater
import android.widget.FrameLayout
import androidx.fragment.app.FragmentActivity
import com.facebook.react.uimanager.ThemedReactContext
import com.ticketmaster.presence.SecureEntryFragment
import com.ticketmasterignite.R

class SecureEntryView(context: Context) : FrameLayout(context) {

  private var offsetTop: Int = 0
  private var secureEntryFragment: SecureEntryFragment? = null

  init {
    LayoutInflater.from(context).inflate(R.layout.secure_entry_layout, this, true)
  }

  private fun getFragmentActivity(): FragmentActivity? {
    return when (val ctx = context) {
      is FragmentActivity -> ctx
      is ThemedReactContext -> ctx.currentActivity as? FragmentActivity
      else -> null
    }
  }

  fun setToken(token: String) {
    val activity = getFragmentActivity() ?: return
    val tokenData = SecureEntryFragment.TokenData(token = token)
    secureEntryFragment = SecureEntryFragment.newInstance(tokenData = tokenData)
    // Defer fragment transaction until the view is attached to the Activity's view hierarchy,
    // otherwise FragmentManager cannot find the container by ID
    post {
      secureEntryFragment?.let { fragment ->
        activity.supportFragmentManager
          .beginTransaction()
          .replace(R.id.secure_entry_container, fragment)
          .commitAllowingStateLoss()
      }
    }
  }

  fun setOffsetTop(offset: Int) {
    offsetTop = offset
    this.offsetTopAndBottom(offsetTop)
  }

  private val measureAndLayout = Runnable {
    measure(
      MeasureSpec.makeMeasureSpec(width, MeasureSpec.EXACTLY),
      MeasureSpec.makeMeasureSpec(height, MeasureSpec.AT_MOST)
    )
    layout(left, top, right, bottom)
  }

  override fun requestLayout() {
    super.requestLayout()
    post(measureAndLayout)
  }
}
