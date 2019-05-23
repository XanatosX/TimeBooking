var fs = require('fs')
var SettingsContainer = require('./SettingsContainer.js')

class SettingsManager {
  constructor (path) {
    this.path = path
    this.path = path + '/settings/'
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path)
    }
  }

  save (name, data) {
    fs.writeFileSync(this.path + name + '.json', data, 'utf8', (err) => {
      if (err) {
        return false
      }
      return true
    })
    return true
  }

  load (name) {
    let path = this.path + name + '.json'
    if (!fs.existsSync(path)) {
      return null
    }
    let content = fs.readFileSync(path, 'utf8')
    if (content === '') {
      return null
    }
    let container = new SettingsContainer()
    let json = JSON.parse(content)
    for(let key in json) {
      container.addSetting(key, json[key])
    }
    return container
  }
}

module.exports = SettingsManager
