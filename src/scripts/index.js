const electron = require('electron')
const remote = electron.remote
const Modal = require('../classes/Modal.js')
const Window = electron.remote.getCurrentWindow()
const TimeFileManager = require('../classes/TimeFileManager.js')
const TimeDataSet = require('../classes/TimeDataSet.js')
const TimeContainer = require('../classes/TimeContainer.js')

var time = new Date()

var dataSet = new TimeDataSet()
var time = new Date()
dataSet.setStartTime(time)
dataSet.setEndTime(time)
var container = new TimeContainer()
container.addTime(dataSet)

var writer = new TimeFileManager(remote.app.getPath('userData'), new Date())
// writer.saveFile(container.getWritable())

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

  times.forEach(function (item) {
    var row = document.createElement('tr')
    var cell = document.createElement('td')
    cell.textContent = item.getStartTime()
    row.appendChild(cell)

    cell = document.createElement('td')
    cell.textContent = item.getEndTime()
    row.appendChild(cell)

    cell = document.createElement('td')
    cell.textContent = item.getDescription()
    row.appendChild(cell)

    cell = document.createElement('td')
    cell.textContent = item.getFormatedTime()
    row.appendChild(cell)

    tableBody.appendChild(row)
  })

  var endRow = document.createElement('tr')
  var endCell = document.createElement('td')
  endCell.setAttribute('colspan', '3')
  endCell.textContent = 'Total worktime:'
  endRow.appendChild(endCell)

  var timeComplete = document.createElement('td')
  var workTimeToday = container.getCompleteWorkTime()
  var workTimeTodayString = ''
  if (workTimeToday !== undefined) {
    workTimeTodayString = getDifference(workTimeToday)
  }
  timeComplete.textContent = workTimeTodayString
  endRow.appendChild(timeComplete)

  tableBody.appendChild(endRow)
}

function getDifference (value) {
  var minutes = Math.floor((value / (1000 * 60)) % 60)
  var hours = Math.floor((value / (1000 * 60 * 60)) % 24)

  hours = (hours < 10) ? '0' + hours : hours
  minutes = (minutes < 10) ? '0' + minutes : minutes

  return hours + ' h ' + minutes + ' m'
}
