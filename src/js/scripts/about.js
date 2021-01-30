const { remote } = require("electron");
const Window = remote.getCurrentWindow();
const ThemeSwitcher = require("./../classes/theme/ThemeSwitcher");
const ContentSwitcher = require("./../classes/util/ContentSwitcher");
const LinkOpenerUtil = require("./../classes/util/LinkOpenerUtil");
const SettingsManager = require("./../classes/settings/SettingsManager.js")
const LanguageManager = require("./../classes/translation/LanguageManager.js");
const linkOpenerUtil = require("./../classes/util/LinkOpenerUtil");
const Modal = require("../classes/electron_extension/Modal.js");

const version = require("../../../package.json").version;
const author = require("../../../package.json").author;


ThemeSwitcher.useDarkMode(remote.nativeTheme.shouldUseDarkColors);
ThemeSwitcher.applyMode(document);
var settingsFolder = remote.app.getPath("userData")
var settingsManager = new SettingsManager(settingsFolder);
var languageManager = new LanguageManager(remote.app.getAppPath() + "/language");

document.addEventListener("DOMContentLoaded", function () {
    let settings = settingsManager.load("mainSettings");
    let language = settings.getSetting("language");
    if (language !== null) {
        languageManager.setLanguage(language);
    }
    languageManager.applyTranslation(document);
    addEvents();
    addInformation();
});

/**
 * Add all the required events
 */
function addEvents() {
    let closeButton = document.getElementById("close");
    closeButton.addEventListener("click" , () => {
        ContentSwitcher.switchToWindow("index", Window);
    });

    let license = document.getElementById("licenseLink");
    license.addEventListener("click" , (element) => {
        let target = element.target;
        let data = target.dataset.markdown;
        var markdownRenderer = new Modal(Window, 800, 800, "markdownRenderer", function () {
        });
        markdownRenderer.isDebug(true);
        markdownRenderer.show();
        let markdownModal = markdownRenderer.getWindow()
        markdownModal.webContents.on('did-finish-load', () => {
            markdownModal.webContents.send("file", data);
        });
    });

    let issueLink = document.getElementById("issueLink");
    issueLink.addEventListener("click", openLink);
    let projectPageLink = document.getElementById("projectPageLink");
    projectPageLink.addEventListener("click", openLink);
}

/**
 * Add all the additional information
 */
function addInformation() {
    let authorInformation = document.getElementById("author");
    authorInformation.innerHTML = " " + author;

    let versionInformation = document.getElementById("version");
    versionInformation.innerHTML = " " + version;
}

/**
 * Open link callback
 * @param {*} element 
 */
function openLink(element) {
    let target = element.target;
    let url = target.dataset.url;
    if (url === "") {
        return;
    }
    linkOpenerUtil.openLink(url);
}