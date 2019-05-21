var fs = require('fs')
const TimeContainer = require('./TimeContainer.js')

class TimeFileManager {
  constructor (path, datetime) {
    this.path = path + '/bookings/'
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path)
    }
    var dd = String(datetime.getDate()).padStart(2, '0')
    var mm = String(datetime.getMonth() + 1).padStart(2, '0')
    this.todayFile = datetime.getFullYear() + mm + dd
  }

  getFiles () {
    var returnFiles = fs.readdirSync(this.path)
    return returnFiles
  }

  loadTodayFile () {
    return this.loadFile(this.todayFile)
  }

  loadFile (name) {
    var path = this.path + name + '.json'
    if (!fs.existsSync(path)) {
      return null
    }
    var content = fs.readFileSync(path)
    var json = JSON.parse(content)

    //var container = new TimeContainer()
    //container.fromJson(json)
    // return container
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
