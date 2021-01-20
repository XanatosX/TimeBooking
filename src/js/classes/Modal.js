const path = require('path');
const electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;

/**
 * This class will allow you to create an modal
 */
class Modal {
  
  /**
   * This method will construct a new modal class
   * 
   * @param  {Window} parent
   * @param  {Int32Array} width
   * @param  {Int32Array} height
   * @param  {String} window
   * @param  {Function} closeFunction
   */
  constructor (parent, width, height, window, closeFunction) {
    this.closeCallback = closeFunction;
    this.parent = parent;
    this.width = width;
    this.height = height;
    this.window = window;
    this.debug = false;
    this.x = this.parent.getPosition()[0];
    this.x += this.parent.getSize()[0] / 2 - this.width / 2;
    this.y = this.parent.getPosition()[1];
    this.y += this.parent.getSize()[1] / 2 - this.height / 2;

    this.win = null;
  }
  /**
   * This method will set the modal to debug
   */
  isDebug () {
    this.debug = true;
  }

  /**
   * This method will show the modal and register the custom callback to the close event
   */
  show () {
    let modalPath = path.join('file://', __dirname, '../../windows/' + this.window + '.html');
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
    });
    this.win.on('close', function () {
      this.win = null;
      if (this.closeCallback !== undefined) {
        this.closeCallback();
      }
    }.bind(this));
    this.win.loadURL(modalPath);

    this.win.once('ready-to-show', () => {
      if (this.debug) {
        this.win.webContents.openDevTools();
      }
      this.win.show();
    });
  }

  /**
   * The method will return you the window
   */
  getWindow () {
    return this.win;
  }
}

module.exports = Modal;
