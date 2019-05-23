const { remote } = require('electron')

const SettingsContainer = require('../classes/SettingsContainer.js')
const Manager = require('../classes/SettingsManager.js')

var settings
var filename
var manager

document.addEventListener('DOMContentLoaded', function () {
  filename = 'mainSettings'
  let folder = remote.app.getPath('userData')
  manager = new Manager(folder)
  settings = manager.load(filename)
  if (settings !== null) {
    fillSettingsWindow()
  }
  addListner()
  fillSettingsContainer()

  console.log(settings)
})

function addListner () {
  let elements = crawlElements(document.getElementById('settingsContent'), 'input')
  let workdaysDiv = document.getElementById('workdays')
  let saveButton = document.getElementById('saveButton')
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
      let name = element.getAttribute('id')
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
    let name = element.getAttribute('id')
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
}

function crawlElements (root, name) {
  let returnValue = []
  if (root.childNodes.length === 0) {
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
