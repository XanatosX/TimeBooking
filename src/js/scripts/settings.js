const { remote } = require('electron');
const Window = remote.getCurrentWindow();

const SettingsContainer = require('./../classes/settings/SettingsContainer.js')
const Manager = require('./../classes/settings/SettingsManager.js')
const LanguageManager = require('./../classes/translation/LanguageManager.js');
const DateFormatter = require("./../classes/util/DateFormatter.js");
const ContentSwitcher = require('./../classes/util/ContentSwitcher');
const Modal = require('./../classes/electron_extension/Modal');
const TableManager = require('./../classes/electron_extension/TableManager');
const ProjectManager = require('./../classes/data_management/ProjectManagement/ProjectManager');
const ThemeSwitcher = require('../classes/theme/ThemeSwitcher');

ThemeSwitcher.useDarkMode(remote.nativeTheme.shouldUseDarkColors);
ThemeSwitcher.applyMode(document);

var settings
var filename
var manager
var languageManager = new LanguageManager(remote.app.getAppPath() + "/language");
var projectManager = new ProjectManager(remote.app.getPath('userData'));
var addProjectWidth = 800;
var addProjectHeight = 800;

document.addEventListener('DOMContentLoaded', function () {
  Window.closeDevTools();
  filename = 'mainSettings'
  let folder = remote.app.getPath('userData')
  manager = new Manager(folder)
  settings = manager.load(filename)

  let language = settings.getSetting("language");
  if (language !== null) {
    languageManager.setLanguage(language);
  }
  languageManager.applyTranslation(document);
  buildProjectTable()

  if (settings !== null) {
    fillSettingsWindow()
  } else {
    settings = new SettingsContainer()
  }

  isDebug = settings.getSetting("debug");

  isDebug = isDebug == null ? false : isDebug;
  if (isDebug) {
    Window.openDevTools();
  }

  addListner()
  fillSettingsContainer()
})

/**
 * Add all the listeners
 */
function addListner () {
  let elements = crawlElements(document.getElementById('settingsContent'), 'input')
  //let workdaysDiv = document.getElementById('workdays')
  let saveButton = document.getElementById('saveButton')
  let addNewProjectButton = document.getElementById('addProject')
  let dateFormat = document.getElementById('dateFormat')
  let exampleDate = document.getElementById('exampleDate')
  let saveAndCloseButton = document.getElementById('saveAndCloseButton')
  let closeButton = document.getElementById('closeButton')
  elements.forEach(function (element) {
    let type = element.getAttribute('type')
    let name = element.getAttribute('id')
    if (name !== null) {
      if (type === 'checkbox') {
        element.addEventListener('click', function () {
          let checked = element.checked
          settings.addSetting(name, checked)
          manager.save(filename, settings.getWritable())
        })
      } else {
        element.addEventListener('change', function () {
          let value = element.value
          settings.addSetting(name, value)
          manager.save(filename, settings.getWritable)
        })
      }
    }
  })

  dateFormat.addEventListener('change', () => {
    DateFormatter.setFormat(dateFormat.value);
    exampleDate.innerHTML = ": " + DateFormatter.getHumanReadable(new Date());
  });

  console.log(dateFormat.value);
  if (dateFormat.value == "") {
    dateFormat.value = DateFormatter.getDefaultFormat();
  }
  DateFormatter.setFormat(dateFormat.value);
  exampleDate.innerHTML = ": " + DateFormatter.getHumanReadable(new Date());


  saveButton.addEventListener('click', function () {
    console.log(settings);
    save();
    projectManager.clearTempProjectFile();
    buildProjectTable();
    let debugCheckbox = document.getElementById('debug');
    let debugSet = debugCheckbox.checked;
    isDebug = debugSet;
    if (debugSet) {
      Window.openDevTools();
      return;
    }
    
    Window.closeDevTools();
  })

  saveAndCloseButton.addEventListener('click', function () {
    save()
    close()
  })

  closeButton.addEventListener('click', function () {
    close()
  })

  addNewProjectButton.addEventListener('click', () => addNewProject());
}

/**
 * Fill in the settings
 */
function fillSettingsWindow () {
  let fields = crawlElements(document.getElementById('settingsContent'), 'input')
  let settingsObject = settings.getObject()
  for (let key in settingsObject) {
    fields.forEach( function (element) {
      let type = element.getAttribute('type')
      let name = element.dataset.setting
      if (name == key) {
        if (type === 'checkbox') {
          element.checked = settingsObject[key]
        } else {
          element.value = settingsObject[key]
        }
      }
    })
  }
}

/**
 * Fill in all the settings
 */
function fillSettingsContainer () {
  let data = crawlElements(document.getElementById('settingsContent'), 'input')
  data.forEach( function (element) {
    let type = element.getAttribute('type')
    let name = element.dataset.setting;
    if (name !== null) {
      if (type === 'checkbox'){
        settings.addSetting(name, element.checked)
      } else {
        settings.addSetting(name, String(element.value))
      }
    } else {
      console.log("Missing id for element "+element)
    }
    
  })
  let languageSelect = document.getElementById("languageSelect");
  let languages = languageManager.getAvailableLanguages();
  let setLanguage = settings.getSetting(languageSelect.dataset.setting);
  let itemsToAdd = [];
  for (let index in languages) {
    let languageName = languages[index];
    let displayName = languageManager.getRawTranslation(languageName.getKey());
    let selection = document.createElement("option");
    displayName = displayName === null ? languageName.getName() : displayName;

    selection.setAttribute("value", languageName.getKey());
    selection.innerHTML = displayName;

    if (setLanguage === languageName.getKey()) {
      selection.setAttribute("selected", "selected");
    }

    itemsToAdd.push(selection);
  }
  itemsToAdd.sort((itemA, itemB) => itemA.innerHTML.localeCompare(itemB.innerHTML));
  itemsToAdd.forEach(item => languageSelect.append(item));

  languageSelect.addEventListener("change", (item) => {
    settings.addSetting(item.target.dataset.setting, item.target.value)
  })
}

/**
 * Crawl the elements and search everything that is matching
 * @param {*} root 
 * @param {string} name 
 */
function crawlElements (root, name) {
  let returnValue = []
  if (root === null || root.childNodes === null || root.childNodes.length === 0) {
    return returnValue
  }

  root.childNodes.forEach(function (element) {
    if (element.tagName === name.toUpperCase()) {
      returnValue.push(element)
    }
    let additionalElements = crawlElements(element, name)
    additionalElements.forEach(function (innerElement) {
      returnValue.push(innerElement)
    })
  })

  return returnValue
}

/**
 * Save the settings
 */
function save() {
  manager.save(filename, settings.getWritable());
  console.log("delete!");
  projectManager.writeProjectFile();
}

/**
 * Close the settings
 */
function close () {
  projectManager.clearTempProjectFile();
  let window = remote.getCurrentWindow();
  ContentSwitcher.switchToWindow('index', window);
}

/**
 * Add a new project
 */
function addNewProject() {
  let addProjectModal = new Modal(remote.getCurrentWindow(), addProjectWidth, addProjectHeight, 'addProject', () => buildReloadProjectTable());
  if (isDebug) {
    addProjectModal.isDebug();
  }
  
  addProjectModal.show();
}

/**
 * Reload the project table
 */
function buildReloadProjectTable() {
  projectManager.reloadProjects();
  buildProjectTable();
}

/**
 * Build the project table
 */
function buildProjectTable() {
  let tableBody = document.getElementById('projectTableBody');
  tableBody.innerHTML = '';
  console.log("build project table!");
  let projects = projectManager.getProjects();
  console.log(projects); 


  projects.forEach(project => {
    let tableRow = document.createElement('tr');

    let projectNameCell = document.createElement('td');
    console.log(project);
    projectNameCell.append(project.getName());
    tableRow.append(projectNameCell);

    let projectActionCell = document.createElement('td');
    let editAction = document.createElement('button');
    editAction.setAttribute('class', 'btn btn-warning');
    editAction.setAttribute('data-id', project.getId());
    editAction.innerHTML = languageManager.getTranslation('edit');
    editAction.addEventListener('click', (event) => {
      let button = event.target;
      let id = button.dataset.id;
      let project = projectManager.getProjectById(id);
      let editProject = new Modal(remote.getCurrentWindow(), addProjectWidth, addProjectHeight, 'addProject', () => buildReloadProjectTable());
      editProject.show();
      let win = editProject.getWindow();
      win.webContents.on('did-finish-load', () => {
        win.webContents.send('id', id);
      });
      console.log(project);
    })

    projectActionCell.appendChild(editAction);

    let deleteButton = document.createElement('button');
    deleteButton.setAttribute('class', 'btn btn-danger');
    deleteButton.setAttribute('data-id', project.getId());
    deleteButton.innerHTML = languageManager.getTranslation('delete');
    if (project.getFolder() === 'default') {
      deleteButton.setAttribute('disabled', true);

    }
    deleteButton.addEventListener('click', (event) => { 
      let button = event.target;
      let id = button.dataset.id;
      projectManager.deleteProjectById(id);
      projectManager.writeTempProjectFile();
      buildProjectTable();
    });

    projectActionCell.appendChild(deleteButton);

    tableRow.append(projectActionCell);

    tableBody.append(tableRow);
  });
}

