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

  // We want to return null to the SDK's Prebuilt Modules if no image overlay text is provided to enable the SDK's default text
  fun optionalString(key: String): String? {
    return configValues[key]
  }

  fun setImage(key: String, uri: String) {
    imageConfigValues[key] = uri
  }

  fun getImage(key: String): String? {
    return imageConfigValues[key]
  }
}
