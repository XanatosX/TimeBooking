const electron = require('electron')
const remote = electron.remote
const Modal = require('../classes/Modal.js')
const Window = electron.remote.getCurrentWindow()
const TimeFileManager = require('../classes/TimeFileManager.js')
const CookieManager = require('../classes/Cookies.js')

var time = new Date()
var cookiesManager = new CookieManager(electron)

document.addEventListener('DOMContentLoaded', function () {
  cookiesManager.getCookie('time', function (index, data) {
    if (isNaN(data)) {
      return
    }
    time = new Date(parseInt(data))
    cookiesManager.clearCookies()
    fillTable()
  })
  addListner()
  fillTable()
}, false)

function addListner () {
  let addTimeButton = document.getElementById('addStartTime')
  let timeOverviewButton = document.getElementById('timeOverview')

  addTimeButton.addEventListener('click', function (event) {
    var addModal = new Modal(Window, 400, 200, 'addTime', function () {
      var timeStr = String(time.getTime())
      cookiesManager.setCookie('time', timeStr)
      Window.reload()
    })
    addModal.isDebug()
    addModal.show()
    var win = addModal.getWindow()

    win.webContents.on('did-finish-load', () => {
      win.webContents.send('time', time.getTime())
    })
  })

  timeOverviewButton.addEventListener('click', function (event) {
    let timeOverviewModal = new Modal(Window, 800, 600, 'timeOverview', function () {

    })
    timeOverviewModal.isDebug()
    timeOverviewModal.show()
  })

  var leftTimeButton = document.getElementById('goLeft')
  leftTimeButton.addEventListener('click', function (event) {
    time.setDate(time.getDate() - 1)
    fillTable()
  })

  var rightTimeButton = document.getElementById('goRight')
  rightTimeButton.addEventListener('click', function (event) {
    time.setDate(time.getDate() + 1)
    fillTable()
  })
};

function fillTable () {
  var tableBody = document.getElementById('tableBody')
  var date = document.getElementById('currentDate')
  date.innerHTML = String(time.getMonth() + 1).padStart(2, '0')
  date.innerHTML += '/'
  date.innerHTML += String(time.getDate()).padStart(2, '0')
  date.innerHTML += '/'
  date.innerHTML += String(time.getFullYear())
  tableBody.innerHTML = ''

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

    var editButton = document.createElement('button')
    editButton.setAttribute('class', 'btn btn-orange')
    editButton.setAttribute('data-id', index)
    editButton.addEventListener('click', function () {
      var id = this.getAttribute('data-id')
      var addModal = new Modal(Window, 400, 200, 'addTime', function () {
        var timeStr = String(time.getTime())
        cookiesManager.setCookie('time', timeStr)
        Window.reload()
      })
      addModal.isDebug()
      addModal.show()
      var win = addModal.getWindow()
      var container = loadTimings(time)
      var times = container.getTimes()
      win.webContents.on('did-finish-load', () => {
        win.webContents.send('id', id)
        win.webContents.send('edit', times[id])
      })
    })
    editButton.textContent = 'Edit'
    actionCell.appendChild(editButton)

    var delButton = document.createElement('button')
    delButton.setAttribute('class', 'btn btn-red')
    delButton.setAttribute('data-id', index)
    delButton.addEventListener('click', function (button) {
      var id = this.getAttribute('data-id')
      deleteTiming(id)
    })
    delButton.textContent = 'Delete'
    actionCell.appendChild(delButton)

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

  var timeStr = String(time.getTime())
  cookiesManager.setCookie('time', timeStr)
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
