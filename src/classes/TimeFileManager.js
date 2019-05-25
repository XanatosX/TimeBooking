var fs = require('fs')
const TimeContainer = require('./TimeContainer.js')

/**
 * This class will allow you to save and load a time container
 */
class TimeFileManager {
  
  /**
   * This constructor will create you an new instance of the time manager
   * @param  {String} path
   * @param  {Date} datetime
   */
  constructor (path, datetime) {
    this.path = path + '/bookings/'
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path)
    }
    let dd = String(datetime.getDate()).padStart(2, '0')
    let mm = String(datetime.getMonth() + 1).padStart(2, '0')
    this.todayFile = datetime.getFullYear() + mm + dd
  }

  /**
   * This method will return you all the files in the directory
   */
  getFiles () {
    let returnFiles = fs.readdirSync(this.path)
    return returnFiles
  }

  /**
   * This method will load the file from today
   */
  loadTodayFile () {
    return this.loadFile(this.todayFile)
  }

  
  /**
   * This method will load you an file from the disk
   * @param  {String} name
   */
  loadFile (name) {
    let path = this.path + name + '.json'
    if (!fs.existsSync(path)) {
      return null
    }
    let content = fs.readFileSync(path, 'utf8')
    if (content === '') {
      console.log('Seems like the file is empty!')
    }
    let json = JSON.parse(content)

    let container = new TimeContainer()
    container.fromJson(json)
    return container
  }

  /**
   * This method will save the file to the disk
   * @param  {Object} json
   */
  saveFile (json) {
    fs.writeFileSync(this.path + this.todayFile + '.json', json, 'utf8', (err) => {
      if (err) {
        return false
      }
      return true
    })
    return true
  }
}

module.exports = TimeFileManager
