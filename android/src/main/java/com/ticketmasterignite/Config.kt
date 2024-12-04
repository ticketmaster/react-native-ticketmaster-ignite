object Config {
  private val configValues = mutableMapOf<String, String>()
  private val imageConfigValues = mutableMapOf<String, String>()

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

  fun setImage(key: String, imageJsonString: String) {
    imageConfigValues[key] = imageJsonString
  }

  fun getImage(key: String): String? {
    return imageConfigValues[key]
  }
}
