const electron = require('electron')
const TimeFileManager = require('../classes/TimeFileManager.js')
const TimeContainer = require('../classes/TimeContainer.js')
const remote = electron.remote

document.addEventListener('DOMContentLoaded', function () {
  setTime()
  addListner()
}, false)

function setTime () {
  var timeInput = document.getElementById('timestamp')

  var today = new Date()
  var time = String(today.getHours()).padStart(2, '0') + ':' + String(today.getMinutes()).padStart(2, '0')
  timeInput.value = time
}

function addListner () {
  var closeBtn = document.getElementById('closeButton')
  var saveBtn = document.getElementById('saveButton')
  closeBtn.addEventListener('click', function (event) {
    var window = remote.getCurrentWindow()
    window.close()
  })
  saveBtn.addEventListener('click', function (event) {
    var timeInput = document.getElementById('timestamp')
    var folder = remote.app.getPath('userData')
    var manager = new TimeFileManager(folder)
    var container = manager.loadTodayFile()
    if (container === null) {
      container = new TimeContainer()
    }
    container.addTime(timeInput.value)
    manager.saveFile(container.getWritable())

    // var window = remote.getCurrentWindow()
    // window.close()
  })
};
