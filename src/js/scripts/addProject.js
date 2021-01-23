const { electron, remote } = require('electron');
const LanguageManager = require('./../js/classes/translation/LanguageManager.js');
const SettingsManager = require('./../js/classes/settings/SettingsManager.js');
const ProjectManager = require('./../classes/data_management/ProjectManagment/ProjectManager');


var settingsFolder = remote.app.getPath('userData');
var settingsManager = new SettingsManager(settingsFolder);
var languageManager = new LanguageManager(remote.app.getAppPath() + "/language");
var projectManager = new ProjectManager(settingsFolder);

document.addEventListener('DOMContentLoaded', function () {
    settingsManager = new SettingsManager(settingsFolder);
    settings = settingsManager.load("mainSettings");
    let language = settings.getSetting("language");
    if (language !== null) {
      languageManager.setLanguage(language);
    }
    languageManager.applyTranslation(document);
    setupEvents()
});

function setupEvents() {
    let closeButton = document.getElementById('closeButton');
    closeButton.addEventListener('click', () => close())

    let saveAndCloseButton = document.getElementById('saveAndCloseButton');
    saveAndCloseButton.addEventListener('click', () => saveAndClose())
}

function saveAndClose() {
    save();
    //close();
}
function save() {
    console.log('save');
}
function close() {
    remote.getCurrentWindow().close()
}