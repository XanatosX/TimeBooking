const electron = require('electron')
const path = require('path')
const BrowserWindow = electron.remote.BrowserWindow

class Modal {
  constructor (parent, width, height, window, closeFunction) {
    this.closeCallback = closeFunction
    this.parent = parent
    this.width = width
    this.height = height
    this.window = window
    this.debug = false
    this.x = this.parent.getPosition()[0]
    this.x += this.parent.getSize()[0] / 2 - this.width / 2
    this.y = this.parent.getPosition()[1]
    this.y += this.parent.getSize()[1] / 2 - this.height / 2

    this.win = null
  }

  isDebug () {
    this.debug = true
  }

  show () {
    var modalPath = path.join('file://', __dirname, '../windows/addTime.html')
    this.win = new BrowserWindow({
      parent: this.parent,
      modal: true,
      show: false,
      center: false,
      x: this.x,
      y: this.y,
      frame: this.debug,
      width: this.width,
      height: this.height,
      webPreferences: {
        nodeIntegration: true
      }
    })
    this.win.on('close', function () {
      this.win = null
      if (this.closeCallback !== undefined) {
        this.closeCallback()
      }
    }.bind(this))
    this.win.loadURL(modalPath)

    this.win.once('ready-to-show', () => {
      if (this.debug) {
        this.win.webContents.openDevTools()
      }
      this.win.show()
    })
  }

  getWindow () {
    return this.win
  }
}

module.exports = Modal
