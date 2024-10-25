enum class EventHeaderType(val value: String) {
  EVENT_INFO("EVENT_INFO"),
  EVENT_SHARE("EVENT_SHARE"),
  EVENT_INFO_SHARE("EVENT_INFO_SHARE"),
  NO_TOOLBARS("NO_TOOLBARS")
}

object EventHeader {
  private var eventHeaderType = Config.get("eventHeaderType")

  fun getShowInfoToolbarButtonValue(): Boolean {
    return eventHeaderType == EventHeaderType.EVENT_INFO.value || eventHeaderType == EventHeaderType.EVENT_INFO_SHARE.value
  }

  fun getShowShareToolbarButtonValue(): Boolean {
    return eventHeaderType == EventHeaderType.EVENT_SHARE.value || eventHeaderType == EventHeaderType.EVENT_INFO_SHARE.value
  }
}
