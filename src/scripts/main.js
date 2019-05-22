const path = require('path')
const url = require('url')
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const globalShortcut = electron.globalShortcut

require('electron-reload')(__dirname)

var win

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.webContents.openDevTools()

  win.loadURL(url.format({
    pathname: path.join(__dirname, '../windows/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.on('closed', () => {
    globalShortcut.unregisterAll()
    win = null
  })

  createApplicationMenu()
  createShortcuts()
}

function createApplicationMenu () {
  var menu = Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        { label: 'Settings',
          click () {
            openSettingsMenu()
          }
        },
        { type: 'separator' },
        { label: 'Exit',
          click () {
            app.quit()
          }
        }
      ]
    }
  ])
  Menu.setApplicationMenu(menu)
}

function openSettingsMenu () {
  var modalPath = path.join('file://', __dirname, '../windows/settings.html')
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
}

function createShortcuts () {
  globalShortcut.register('f5', function() {
		win.reload()
	})
}

app.on('ready', createWindow)
