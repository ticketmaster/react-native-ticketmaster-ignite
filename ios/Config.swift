import React

class Config {

    static let shared = Config()

    private var configModule: ConfigModule? {
        return RCTBridge.current()?.module(forName: "Config") as? ConfigModule
    }

    func get(for key: String) -> String {
        return configModule?.getConfig(key) ?? ""

    }

    func set(for key: String, value: String) {
        configModule?.setConfig(key, value: value)
    }
}
