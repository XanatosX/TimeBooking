const path = require("path")
const { app, Menu, BrowserWindow, globalShortcut, nativeTheme, nativeImage, Tray } = require("electron")
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

var tray;
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
    icon: nativeImage.createFromPath(iconUtil.getIcon("application.png")),
    webPreferences: {
      nodeIntegration: true
    }
  })
  languageManager = new LanguageManager(app.getAppPath() + "/resources/language");

  let settings = settingsManager.load("mainSettings");
  let language = settings.getSetting("language");
  if (language !== null) {
    languageManager.setLanguage(language);
  }

  showMainWindow();
  //win.openDevTools();

  win.on("closed", () => {
    globalShortcut.unregisterAll()
    win = null
  });

  createApplicationMenu()
  createGlobalShortcuts()
  
  win.removeMenu();
  addTrayIcon();
}

/**
 * Show the main window
 */
function showMainWindow() {
  ContentSwitcher.switchToWindow("index", win);
}

/**
 * Create the application menu and set it
 */
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
          //@todo get this icon thing into a working state!
          //icon: iconUtil.getIcon("settings.png")
        },
        { type: "separator" },
        {
          label: languageManager.getTranslation("exit"),
          click() {
            closeApplication();
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
        reportBug();
      }
    }
  ])
  Menu.setApplicationMenu(menu)
}

/**
 * Report a bug
 */
function reportBug() {
  LinkOpenerUtil.openLink("https://github.com/XanatosX/TimeBooking/issues");
}

/**
 * Close the application
 */
function closeApplication() {
  tray.destroy();
  let windows = BrowserWindow.getAllWindows();
  windows.forEach( item => {
    item.closeDevTools();
    item.close();
  });
  //win.close();
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
function openSettingsMenu(shouldFocus) {
  ContentSwitcher.switchToWindow("settings", win);
  if (shouldFocus === true) {
    win.focus();
  }
}

/**
 * Open up the about menu
 */
function openAboutMenu() {
  ContentSwitcher.switchToWindow("about", win);
  win.focus();
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

/**
 * Add the tray icon
 */
function addTrayIcon() {
  tray = new Tray(iconUtil.getUrlIconPath("application.png"));
  let contextMenu = Menu.buildFromTemplate(
    [
       {
        label: languageManager.getTranslation("addTime"),
        type: "normal",
        click() {
          showMainWindow();
          win.webContents.once("did-finish-load", () => {
            win.webContents.send("AddTime");
          });
        }
      },   
      {
        type: "separator"
      },
      {
        label: languageManager.getTranslation("settings"),
        type: "normal",
        click() {
          openSettingsMenu(true);
        }
      },
      {
        type: "separator"
      },
      {
        label: languageManager.getTranslation("toFront"),
        type: "normal",
        click() {
          win.focus();
        }
      },
      {
        type: "separator"
      },
      {
        label: languageManager.getTranslation("about"),
        type: "normal",
        click() {
          openAboutMenu();
        }
      },
      {
        label: languageManager.getTranslation("reportABug"),
        type: "normal",
        click() {
          reportBug();
        }
      },
      {
        type: "separator"
      },
      {
        label: languageManager.getTranslation("close"),
        type: "normal",
        click() {
          closeApplication()
        }
      }
    ]
  );
  tray.setToolTip(languageManager.getTranslation("applicationToolTip"));
  tray.setContextMenu(contextMenu);
  tray.on("click", () => win.focus());
}