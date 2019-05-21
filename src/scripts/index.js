const electron = require('electron')
const remote = electron.remote
const Modal = require('../classes/Modal.js')
const Window = electron.remote.getCurrentWindow()
const TimeFileManager = require('../classes/TimeFileManager.js')
// const TimeContainer = require('../classes/TimeContainer.js')

document.addEventListener('DOMContentLoaded', function () {
  addListner()
  fillTable()
}, false)

function addListner () {
  var addTimeButton = document.getElementById('addStartTime')
  addTimeButton.addEventListener('click', function (event) {
    var addModal = new Modal(Window, 400, 200, 'addTime', function () {
      Window.reload()
    })
    addModal.isDebug()
    addModal.show()
  })
};

function fillTable () {
  var tableBody = document.getElementById('tableBody')

  var folder = remote.app.getPath('userData')
  var manager = new TimeFileManager(folder)
  var container = manager.loadTodayFile()

  if (container === null) {
    return
  }

  var times = container.getTimes()

  for (var i = 0; i < times.length; i += 2) {
    var row = document.createElement('tr')
    var start = times[i]

    var cell = document.createElement('td')
    cell.textContent = start
    row.appendChild(cell)

    var end = times[i + 1]

    cell = document.createElement('td')
    cell.textContent = end
    row.appendChild(cell)

    cell = document.createElement('td')
    cell.textContent = ''
    row.appendChild(cell)

    cell = document.createElement('td')
    cell.textContent = ''
    row.appendChild(cell)
    tableBody.appendChild(row)
  }
}
