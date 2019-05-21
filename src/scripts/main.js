const path = require('path')
const url = require('url')
require('electron-reload')(__dirname)

const { app, BrowserWindow } = require('electron')

function createWindow () {
  let win = new BrowserWindow({
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
    win = null
  })
}

app.on('ready', createWindow)
