var fs = require('fs')

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
}

module.exports = SettingsManager
