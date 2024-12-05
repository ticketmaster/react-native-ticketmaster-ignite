enum class EventHeaderType(val value: String) {
  EVENT_INFO("EVENT_INFO"),
  EVENT_SHARE("EVENT_SHARE"),
  EVENT_INFO_SHARE("EVENT_INFO_SHARE"),
  NO_TOOLBARS("NO_TOOLBARS")
}

object EventHeader {
  fun getShowInfoToolbarButtonValue(eventHeaderType: String): Boolean {
    return eventHeaderType == EventHeaderType.EVENT_INFO.value || eventHeaderType == EventHeaderType.EVENT_INFO_SHARE.value
  }

  fun getShowShareToolbarButtonValue(eventHeaderType: String): Boolean {
    return eventHeaderType == EventHeaderType.EVENT_SHARE.value || eventHeaderType == EventHeaderType.EVENT_INFO_SHARE.value
  }
}
