object EventHeader {
  private var eventHeaderType = Config.get("eventHeaderType")

  fun getShowInfoToolbarButtonValue(): Boolean {
    return eventHeaderType == "EVENT_INFO" || eventHeaderType == "EVENT_INFO_SHARE"
  }

  fun getShowShareToolbarButtonValue(): Boolean {
    return eventHeaderType == "EVENT_SHARE" || eventHeaderType == "EVENT_INFO_SHARE"
  }
}
