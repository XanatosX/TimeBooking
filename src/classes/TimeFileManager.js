var fs = require('fs')

class TimeFileManager {
  constructor (path) {
    this.path = path + '/bookings/'
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path)
    }
    var today = new Date()
    var dd = String(today.getDate()).padStart(2, '0')
    var mm = String(today.getMonth() + 1).padStart(2, '0')
    this.todayFile = today.getFullYear() + mm + dd
  }

  getFiles () {
  }

  loadFile (path) {
  }

  saveFile (json) {
    fs.writeFile(this.path + this.todayFile + '.json', json, 'utf8', (err) => {
      if (err) {
        return false
      }
      return true
    })
    return true
  }
}

module.exports = TimeFileManager
