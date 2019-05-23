const { remote } = require('electron')

const SettingsContainer = require('../classes/SettingsContainer.js')
const Manager = require('../classes/SettingsManager.js')

var settings
var filename
var manager

document.addEventListener('DOMContentLoaded', function () {
  settings = new SettingsContainer()
  filename = 'mainSettings'
  let folder = remote.app.getPath('userData')
  manager = new Manager(folder)
  addListner()
  fillSettingsContainer()

  console.log(settings)
})

function addListner () {
  let workdaysDiv = document.getElementById('workdays')
  let saveButton = document.getElementById('saveButton')
  let closeButton = document.getElementById('closeButton')
  workdaysDiv.childNodes.forEach(function (element) {
    if (element.tagName === 'DIV') {
      element.childNodes.forEach(function (inputElement) {
        if (inputElement.tagName === 'INPUT') {
          inputElement.addEventListener('click', function () {
            let name = inputElement.getAttribute('id')
            let checked = inputElement.checked

            settings.addSetting(name, checked)
            manager.save(filename, settings.getWritable())
          })
        }
      })
    }
  })

  saveButton.addEventListener('click', function () {
    manager.save(filename, settings.getWritable())
  })

  closeButton.addEventListener('click', function () {
    close()
  })
}


function fillSettingsContainer () {
  let data = crawlElements(document.getElementById('workdays'), 'input')
  data.forEach( function (element) {
    let type = element.getAttribute('type')
    let name = element.getAttribute('id')
    if (type === 'checkbox'){
      settings.addSetting(name, element.checked)
    } else {
      settings.addSettings(name, element.value)
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
