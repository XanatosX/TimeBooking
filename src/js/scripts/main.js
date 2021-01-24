const path = require('path')
const url = require('url')
const { electron, app, Menu, BrowserWindow, globalShortcut } = require('electron')
const LanguageManager = require('./../classes/translation/LanguageManager.js');
const SettingsManager = require('./../classes/settings/SettingsManager.js')

try {
  require('electron-reload')(__dirname)
} catch (ex) {
  console.log('We are not debugging this, right? RIGHT?');
}

var win
var settingOpen;
var settingsFolder = app.getPath('userData')
var settingsManager = new SettingsManager(settingsFolder);
var languageManager;


function createWindow() {
  settingOpen = false;
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  languageManager = new LanguageManager(app.getAppPath() + "/language");

  let settings = settingsManager.load("mainSettings");
  let language = settings.getSetting("language");
  if (language !== null) {
    languageManager.setLanguage(language);
  }

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
            reloadAllWindows();
          }
        }
      ]
    }, {
      label: languageManager.getTranslation("projects"),
      enabled: false,
      id: "projectMenu"
    }
  ])
  Menu.setApplicationMenu(menu)
}

/**
 * Reload all the windows
 */
function reloadAllWindows() {
  let windows = BrowserWindow.getAllWindows();
  windows.forEach( item => item.reload());
}

function openSettingsMenu() {
  win.loadURL(url.format({
    pathname: path.join(__dirname, '../../windows/settings.html'),
    protocol: 'file:',
    slashes: true
  }));
}

function createGlobalShortcuts() {
  globalShortcut.register('f5', () => reloadAllWindows());
}

app.on('ready', () => {
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