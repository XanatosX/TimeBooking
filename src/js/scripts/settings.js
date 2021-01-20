const { remote } = require('electron');
const Window = remote.getCurrentWindow();

const SettingsContainer = require('./../classes/SettingsContainer.js')
const Manager = require('./../classes/SettingsManager.js')
const LanguageManager = require('./../classes/translation/LanguageManager.js');

var settings
var filename
var manager
var languageManager = new LanguageManager("./language");

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

function addListner () {
  let elements = crawlElements(document.getElementById('settingsContent'), 'input')
  let workdaysDiv = document.getElementById('workdays')
  let saveButton = document.getElementById('saveButton')
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

  saveButton.addEventListener('click', function () {
    console.log(settings);
    Window.reload();
    manager.save(filename, settings.getWritable())
  })

  saveAndCloseButton.addEventListener('click', function () {
    console.log(settings);
    manager.save(filename, settings.getWritable())
    close()
  })

  closeButton.addEventListener('click', function () {
    close()
  })
}

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

function close () {
  let window = remote.getCurrentWindow()
  window.close()
}
