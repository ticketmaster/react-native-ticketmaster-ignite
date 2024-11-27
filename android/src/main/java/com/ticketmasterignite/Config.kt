object Config {
  private val configValues = mutableMapOf<String, String>()

  fun set(key: String, value: String) {
    configValues[key] = value
  }

  fun get(key: String): String {
    return if (configValues[key] != null) {
      configValues[key].toString()
    } else {
      ""
    }
  }

  fun optionalString(key: String): String? {
    return configValues[key]
  }
}
