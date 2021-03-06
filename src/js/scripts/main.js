const path = require("path")
const url = require("url")
const { electron, app, Menu, BrowserWindow, globalShortcut, nativeTheme, nativeImage } = require("electron")
const LanguageManager = require("./../classes/translation/LanguageManager.js");
const SettingsManager = require("./../classes/settings/SettingsManager.js");
const ContentSwitcher = require("../classes/util/ContentSwitcher.js");
const LinkOpenerUtil = require("./../classes/util/LinkOpenerUtil");
const iconUtil = require("../classes/util/IconUtil.js");

try {
  require("electron-reload")(__dirname)
} catch (ex) {
  console.log("We are not debugging this, right? RIGHT?");
}

var win
var settingOpen;
var settingsFolder = app.getPath("userData")
var settingsManager = new SettingsManager(settingsFolder);
var languageManager;

/**
 * Create the main window
 */
function createWindow() {
  iconUtil.setIsDark(nativeTheme.shouldUseDarkColors);
  settingOpen = false;
  win = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: "hidden",
    frame: false,
    icon: nativeImage.createFromPath(iconUtil.getIcon("application.ico")),
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
    pathname: path.join(__dirname, "../../windows/index.html"),
    protocol: "file:",
    slashes: true
  }))
  //win.openDevTools();

  win.on("closed", () => {
    globalShortcut.unregisterAll()
    win = null
  })

  createApplicationMenu()
  createGlobalShortcuts()
  
  win.removeMenu();
}

/**
 * Create the application menu and set it
 */
function createApplicationMenu() {
  iconUtil.setBasePath("../" + iconUtil.getDefaultPath());
  var menu = Menu.buildFromTemplate([
    {
      label: languageManager.getTranslation("file"),
      submenu: [
        {
          label: languageManager.getTranslation("settings"),
          click() {
              openSettingsMenu()
          }
          //@todo get this icon thing into a working state!
          //icon: iconUtil.getIcon("settings.png")
        },
        { type: "separator" },
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
          accelorator: "f5",
          click() {
            reloadAllWindows();
          }
        }
      ]
    }, {
      label: languageManager.getTranslation("about"),
      click() {
        openAboutPage()
      }
    }, {
      label: languageManager.getTranslation("reportABug"),
      click() {
        LinkOpenerUtil.openLink("https://github.com/XanatosX/TimeBooking/issues");
      }
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

function openAboutPage() {
  ContentSwitcher.switchToWindow("about", win);
}

/**
 * Open the settings menu
 */
function openSettingsMenu() {
  ContentSwitcher.switchToWindow("settings", win);
}

/**
 * Set the global shortcuts
 */
function createGlobalShortcuts() {
  globalShortcut.register("f5", () => reloadAllWindows());
}

app.on("ready", () => {
  createWindow()
});

app.on("windwos-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (win === null) {
    createWindow()
  }
})