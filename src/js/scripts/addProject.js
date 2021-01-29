const { electron, remote, ipcRenderer } = require("electron");
const Window = remote.getCurrentWindow();
const LanguageManager = require("./../js/classes/translation/LanguageManager.js");
const SettingsManager = require("./../js/classes/settings/SettingsManager.js");
const ProjectManager = require("./../js/classes/data_management/ProjectManagment/ProjectManager");
const ProjectData = require("./../js/classes/data_management/ProjectManagment/ProjectData.js");
const ThemeSwitcher = require("../classes/theme/ThemeSwitcher");

ThemeSwitcher.useDarkMode(remote.nativeTheme.shouldUseDarkColors);
ThemeSwitcher.applyMode(document);

var settingsFolder = remote.app.getPath('userData');
var settingsManager = new SettingsManager(settingsFolder);
var languageManager = new LanguageManager(remote.app.getAppPath() + "/language");
var projectManager = new ProjectManager(settingsFolder);
var project = null;

document.addEventListener('DOMContentLoaded', function () {
    Window.openDevTools();
    settingsManager = new SettingsManager(settingsFolder);
    settings = settingsManager.load("mainSettings");
    let language = settings.getSetting("language");
    if (language !== null) {
      languageManager.setLanguage(language);
    }
    languageManager.applyTranslation(document);
    setupEvents()

    isDebug = settings.getSetting("debug");

    isDebug = isDebug == null ? false : isDebug;
    if (isDebug) {
      Window.openDevTools();
    }
    
    let nameBox = document.getElementById('projectName');
    nameBox.focus();
});

ipcRenderer.on('id', (event, message) => {
    console.log(projectManager);
    project = projectManager.getProjectById(message);
    console.log(project);
    let nameBox = document.getElementById('projectName');
    nameBox.value = project.getName();
    console.log("Got id: " + message);
    console.log("project");
    console.log(project);
  });

  /**
   * This method will setup all the events
   */
function setupEvents() {
    let closeButton = document.getElementById('closeButton');
    closeButton.addEventListener('click', () => close())

    let acceptAndCloseButton = document.getElementById('acceptAndCloseButton');
    acceptAndCloseButton.addEventListener('click', () => acceptAndClose())
}

/**
 * This method will save and close
 */
function acceptAndClose() {
    save();
    close();
}

/**
 * This method will save the changes to the temp config
 */
function save() {
    let nameBox = document.getElementById('projectName');
    let name = nameBox.value;
    if (project !== null) {
        let newProject = new ProjectData(name, project.getFolder());
        projectManager.replaceProject(project, newProject);
    } else {
        console.log(typeof(name));
        let folder = name.replace(/[ \\\/:<>|*\?]+/g, '');
        let newProject = new ProjectData(name, folder);
        projectManager.addProject(newProject);
    }

    projectManager.writeTempProjectFile();
    console.log('save');
}

/**
 * Close this form
 */
function close() {
    var window = remote.getCurrentWindow();
    window.close();
}