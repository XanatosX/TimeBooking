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
    this.x = this.parent.getPosition()[0]
    this.x += this.parent.getSize()[0] / 2 - this.width / 2
    this.y = this.parent.getPosition()[1]
    this.y += this.parent.getSize()[1] / 2 - this.height / 2
  }

  show () {
    var modalPath = path.join('file://', __dirname, '../windows/addTime.html')
    let win = new BrowserWindow({
      parent: this.parent,
      modal: true,
      show: false,
      center: false,
      x: this.x,
      y: this.y,
      // frame: false,
      width: this.width,
      height: this.height
    })
    win.on('close', function () {
      win = null
      if (this.closeCallback !== undefined) {
        this.closeCallback()
      }
    })
    win.loadURL(modalPath)
    win.once('ready-to-show', () => {
      win.show()
    })
  }
}

module.exports = Modal
