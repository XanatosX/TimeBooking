const path = require('path')
const url = require('url')
const electron = require('electron')
const { setegid } = require('process')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const globalShortcut = electron.globalShortcut
const LanguageManager = require('./../classes/translation/LanguageManager.js');
const SettingsManager = require('./../classes/SettingsManager.js')

require('electron-reload')(__dirname)

var win
var settingsFolder = app.getPath('userData')
var settingsManager = new SettingsManager(settingsFolder);
var languageManager = new LanguageManager("./language");

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  //win.openDevTools();

  win.loadURL(url.format({
    pathname: path.join(__dirname, '../../windows/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.on('closed', () => {
    globalShortcut.unregisterAll()
    win = null
  })

  createApplicationMenu()
  createGlobalShortcuts()
}

function createApplicationMenu() {
  var menu = Menu.buildFromTemplate([
    {
      label: languageManager.getTranslation("file"),
      submenu: [
        {
          label: languageManager.getTranslation("settings"),
          click() {
            openSettingsMenu()
          }
        },
        { type: 'separator' },
        {
          label: languageManager.getTranslation("exit"),
          click() {
            app.quit()
          }
        }
      ]
    }, {
      label: languageManager.getTranslation("menuDebug"),
      submenu: [
        {
          label: languageManager.getTranslation("reload"),
          accelorator: 'f5',
          click() {
            win.reload()
          }
        }
      ]
    }
  ])
  Menu.setApplicationMenu(menu)
}

function openSettingsMenu() {
  var modalPath = path.join('file://', __dirname, '../../windows/settings.html')
  var width = win.getSize()[0] - 50
  var height = win.getSize()[1] - 50
  var x = win.getPosition()[0]
  x += win.getSize()[0] / 2 - width / 2
  var y = win.getPosition()[1]
  y += win.getSize()[1] / 2 - height / 2
  var settingsWin = new BrowserWindow({
    parent: win,
    modal: true,
    show: false,
    center: false,
    x: x,
    y: y,
    frame: true,
    width: width,
    height: height,
    webPreferences: {
      nodeIntegration: true
    }
  })
  settingsWin.loadURL(modalPath)
  settingsWin.once('ready-to-show', () => {
    settingsWin.show()
  })
  settingsWin.on("close", () => {
    win.reload();
  })
}

function createGlobalShortcuts() {
}

app.on('ready', () => {
  let settings = settingsManager.load("mainSettings");
  let language = settings.getSetting("language");
  if (language !== null) {
    languageManager.setLanguage(language);
  }
  createWindow()
});

app.on('windwos-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})