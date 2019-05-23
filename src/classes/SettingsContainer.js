class SettingsContainer {
  constructor () {
    this.settings = {}
  }

  addSetting (name, data) {
    this.settings[name] = data
  }

  getSetting (name) {
    if (this.settings.name === undefined) {
      return null
    }
    return this.settings.name
  }

  getWritable () {
    return JSON.stringify(this.settings)
  }
}

module.exports = SettingsContainer
