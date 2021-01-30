const { remote, ipcRenderer } = require("electron");
const Window = remote.getCurrentWindow();
const LanguageManager = require("./../classes/translation/LanguageManager");
const SettingsManager = require("./../classes/settings/SettingsManager");
const ThemeSwitcher = require("../classes/theme/ThemeSwitcher");
var MarkdownIt = require('markdown-it');
const fs = require("fs");

ThemeSwitcher.useDarkMode(remote.nativeTheme.shouldUseDarkColors);
ThemeSwitcher.applyMode(document);

Window.openDevTools();
//var settingsFolder = remote.app.getPath('userData');
//var settingsManager = new SettingsManager(settingsFolder);
//var languageManager = new LanguageManager(remote.app.getAppPath() + "/language");

document.addEventListener('DOMContentLoaded', function () {
    let closeButton = document.getElementById('closeButton');
    closeButton.addEventListener('click', () => close())
});

ipcRenderer.on('file', (event, message) => {
    let basePath = remote.app.getAppPath();
    let realPath =  basePath + "/" + message;
    console.log(realPath);
    if (!fs.existsSync(message)) {
        //close();
        return;
    }
    let content = fs.readFileSync(message, 'utf-8');
    console.log(content);
    let markdownTarget = document.getElementById("markdownContent");
    md = new MarkdownIt();
    var result = md.render(content);
    markdownTarget.innerHTML = result;
});