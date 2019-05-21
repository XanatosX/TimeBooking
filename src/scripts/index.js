const electron = require('electron')
const remote = electron.remote
const Modal = require('../classes/Modal.js')
const Window = electron.remote.getCurrentWindow()
const TimeFileManager = require('../classes/TimeFileManager.js')
// const TimeContainer = require('../classes/TimeContainer.js')

var time = new Date()

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
  var manager = new TimeFileManager(folder, time)
  var container = manager.loadTodayFile()

  if (container === null) {
    return
  }

  var times = container.getTimes()
  var timings = container.getWorkTimes()

  var index = 0
  for (var i = 0; i < times.length; i += 2) {
    var row = document.createElement('tr')
    var start = times[i]

    var cell = document.createElement('td')
    cell.textContent = convertToTime(start)
    row.appendChild(cell)

    var end = times[i + 1]
    var endVal = ''
    if (end !== undefined) {
      endVal = convertToTime(end)
    }

    cell = document.createElement('td')
    cell.textContent = endVal
    row.appendChild(cell)

    cell = document.createElement('td')
    cell.textContent = ''
    row.appendChild(cell)

    var timingVal = ''
    if (timings[index] !== undefined) {
      timingVal = getDifference(timings[index])
    }
    cell = document.createElement('td')
    cell.textContent = timingVal
    row.appendChild(cell)
    tableBody.appendChild(row)
    index++
  }

  var endRow = document.createElement('tr')
  var endCell = document.createElement('td')
  endCell.setAttribute('colspan', '3')
  endCell.textContent = 'Total worktime:'
  endRow.appendChild(endCell)

  var timeComplete = document.createElement('td')
  var workTimeToday = container.getCompleteWorkTime()
  var workTimeTodayString = ''
  console.log(workTimeToday)
  if (workTimeToday !== undefined) {
      workTimeTodayString = getDifference(workTimeToday)
  }
  timeComplete.textContent = workTimeTodayString
  endRow.appendChild(timeComplete)

  tableBody.appendChild(endRow)
}

function convertToTime (value) {
  var date = new Date(value)
  var time = String(date.getHours()).padStart(2, '0') + ':'
  time += String(date.getMinutes()).padStart(2, '0')
  return time
}

function getDifference (value) {
  var minutes = Math.floor((value / (1000 * 60)) % 60)
  var hours = Math.floor((value / (1000 * 60 * 60)) % 24)

  hours = (hours < 10) ? '0' + hours : hours
  minutes = (minutes < 10) ? '0' + minutes : minutes

  return hours + ' h ' + minutes + ' m'
}
