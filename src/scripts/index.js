const electron = require('electron')
const remote = electron.remote
const Modal = require('../classes/Modal.js')
const Window = electron.remote.getCurrentWindow()
const TimeFileManager = require('../classes/TimeFileManager.js')
const TimeDataSet = require('../classes/TimeDataSet.js')
const TimeContainer = require('../classes/TimeContainer.js')

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
    var win = addModal.getWindow()

    win.webContents.on('did-finish-load', () => {
      win.webContents.send('time', time.getTime())
    })
  })
};

function fillTable () {
  var tableBody = document.getElementById('tableBody')

  var container = loadTimings(time)

  if (container === null) {
    return
  }
  var times = container.getTimes()

  var index = 0
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

    var actionCell = document.createElement('td')
    var delButton = document.createElement('button')
    delButton.setAttribute('class', 'btn btn-red')
    delButton.setAttribute('data-id', index)
    delButton.addEventListener('click', function (button) {
      var id = this.getAttribute('data-id')
      console.log(id)
      deleteTiming(id)
    })
    actionCell.appendChild(delButton)
    delButton.textContent = 'Delete'

    row.appendChild(actionCell)

    tableBody.appendChild(row)
    index++
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

function deleteTiming (id) {
  var container = loadTimings(time)
  if (container === undefined) {
    return
  }

  container.deleteDataSet(id)

  var writer = new TimeFileManager(remote.app.getPath('userData'), time)
  writer.saveFile(container.getWritable())

  Window.reload()
}

function loadTimings (datetime) {
  var folder = remote.app.getPath('userData')
  var manager = new TimeFileManager(folder, datetime)
  return manager.loadTodayFile()
}

function getDifference (value) {
  var minutes = Math.floor((value / (1000 * 60)) % 60)
  var hours = Math.floor((value / (1000 * 60 * 60)) % 24)

  hours = (hours < 10) ? '0' + hours : hours
  minutes = (minutes < 10) ? '0' + minutes : minutes

  return hours + ' h ' + minutes + ' m'
}
