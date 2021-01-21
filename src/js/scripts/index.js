const electron = require('electron');
const remote = electron.remote;
const Modal = require('./../classes/Modal.js');
const Window = electron.remote.getCurrentWindow();
const TimeFileManager = require('./../classes/TimeFileManager.js');
const TimeDataSet  = require('./../classes/TimeDataSet.js');
const CookieManager = require('./../classes/Cookies.js');
const SettingsManager = require('./../classes/SettingsManager.js')
const LanguageManager = require('./../classes/translation/LanguageManager.js');

var time = new Date();

var cookiesManager = new CookieManager(electron);
var settingsFolder = remote.app.getPath('userData')
var settingsManager = new SettingsManager(settingsFolder);
var languageManager = new LanguageManager(remote.app.getAppPath() + "/language");
var isDebug = false;
var addTimeModalWidth = 600;
var addTimeModalHeight = 250;

document.addEventListener('DOMContentLoaded', function () {
  Window.closeDevTools();
  let settings = settingsManager.load("mainSettings");
  let language = settings.getSetting("language");
  if (language !== null) {
    languageManager.setLanguage(language);
  }
  languageManager.applyTranslation(document);
  isDebug = settings.getSetting("debug");

  isDebug = isDebug == null ? false : isDebug;
  if (isDebug) {
    Window.openDevTools();
  }
  cookiesManager.getCookie('time', function (index, data) {
    if (isNaN(data)) {
      return;
    }
    time = new Date(parseInt(data));
    console.log(time);
    cookiesManager.clearCookies();
    fillTable();
  });
  addListener();
  fillTable();
}, false);



function addListener () {

  let todayButton = document.getElementById('today');
  let leftTimeButton = document.getElementById('goLeft');
  let rightTimeButton = document.getElementById('goRight');

  let addTimeButton = document.getElementById('addStartTime');
  let timeOverviewButton = document.getElementById('timeOverview');

  addTimeButton.addEventListener('click', function (event) {
    var addTime = new Modal(Window, addTimeModalWidth, addTimeModalHeight, 'addTime', function () {
      var timeStr = String(time.getTime());
      cookiesManager.setCookie('time', timeStr);
      Window.reload();
    });
    if (isDebug) {
      addTime.isDebug();
    }
    
    addTime.show();
    var win = addTime.getWindow();

    win.webContents.on('did-finish-load', () => {
      win.webContents.send('time', time.getTime());
    });
  });

  timeOverviewButton.addEventListener('click', function (event) {
    let timeOverviewModal = new Modal(Window, 800, 650, 'timeOverview', function () {

    });
    if (isDebug) {
      timeOverviewModal.isDebug();
    }
    timeOverviewModal.show();
  });

  todayButton.addEventListener('click', function (event) {
    time = new Date();
    fillTable();
  });

  leftTimeButton.addEventListener('click', function (event) {
    time.setDate(time.getDate() - 1);
    fillTable();
  });

  
  rightTimeButton.addEventListener('click', function (event) {
    time.setDate(time.getDate() + 1);
    fillTable();
  });
}

function fillTable () {
  showTodayButton();
  var tableBody = document.getElementById('tableBody');
  var date = document.getElementById('currentDate');

  date.innerHTML = ": ";
  date.innerHTML += String(time.getMonth() + 1).padStart(2, '0');
  date.innerHTML += '/';
  date.innerHTML += String(time.getDate()).padStart(2, '0');
  date.innerHTML += '/';
  date.innerHTML += String(time.getFullYear());
  tableBody.innerHTML = '';

  var container = loadTimings(time);

  if (container === null) {
    return;
  }
  var times = container.getTimes();

  var index = 0;
  times.forEach(function (item) {
    var row = document.createElement('tr');
    var cell = document.createElement('td');
    cell.textContent = item.getStartTime();
    row.appendChild(cell);

    cell = document.createElement('td');
    cell.textContent = item.getEndTime();
    row.appendChild(cell);

    cell = document.createElement('td');
    cell.textContent = item.getDescription();
    row.appendChild(cell);

    cell = document.createElement('td');
    cell.textContent = item.getFormatedTime();
    row.appendChild(cell);

    var actionCell = document.createElement('td');
    let actionButtonGroup = document.createElement('div');
    let secondButtonGroup = document.createElement('div');
    actionButtonGroup.setAttribute('class', "btn-group mr-2");
    secondButtonGroup.setAttribute('class', "btn-group mr-2");
    actionButtonGroup.setAttribute('role', "group");
    secondButtonGroup.setAttribute('role', "group");

    var editButton = document.createElement('button');
    editButton.setAttribute('class', 'btn btn-warning');
    editButton.setAttribute('data-id', index);
    editButton.addEventListener('click', function () {
      var id = this.getAttribute('data-id');
      var addTime = new Modal(Window, addTimeModalWidth, addTimeModalHeight, 'addTime', function () {
        var timeStr = String(time.getTime());
        cookiesManager.setCookie('time', timeStr);
        Window.reload();
      });
      if (isDebug) {
        addTime.isDebug();
      }
      addTime.show();
      var win = addTime.getWindow();
      var container = loadTimings(time);
      var times = container.getTimes();
      win.webContents.on('did-finish-load', () => {
        win.webContents.send('id', id);
        win.webContents.send('edit', times[id]);
      });
    });
    editButton.textContent = languageManager.getTranslation("edit");
    

    if (item.getEndTime() == "")
    {
      var setEndTimeButton = document.createElement('button');
      setEndTimeButton.setAttribute('class', 'btn btn-success');
      setEndTimeButton.setAttribute('data-id', index);
      setEndTimeButton.textContent = languageManager.getTranslation("endNow");
      setEndTimeButton.addEventListener('click', function (button) {
        var id = this.getAttribute('data-id');
        endTiming(id);
      });
      actionButtonGroup.appendChild(setEndTimeButton);
    }
    actionButtonGroup.appendChild(editButton);

    var delButton = document.createElement('button');
    delButton.setAttribute('class', 'btn btn-danger');
    delButton.setAttribute('data-id', index);
    delButton.addEventListener('click', function (button) {
      var id = this.getAttribute('data-id');
      deleteTiming(id);
    });
    delButton.textContent = languageManager.getTranslation("delete");
    secondButtonGroup.appendChild(delButton);

    actionCell.appendChild(actionButtonGroup);
    actionCell.appendChild(secondButtonGroup);
    row.appendChild(actionCell);

    tableBody.appendChild(row);
    index++;
  });

  var endRow = document.createElement('tr');
  var endCell = document.createElement('td');
  endCell.setAttribute('colspan', '3');
  endCell.textContent = languageManager.getTranslation("totalWorktime");
  endRow.appendChild(endCell);

  var timeComplete = document.createElement('td');
  var workTimeToday = container.getCompleteWorkTime();
  var workTimeTodayString = '';
  if (workTimeToday !== undefined) {
    workTimeTodayString = getDifference(workTimeToday);
  }
  timeComplete.textContent = workTimeTodayString;
  endRow.appendChild(timeComplete);

  var emptyCell = document.createElement('td');
  endRow.appendChild(emptyCell);

  tableBody.appendChild(endRow);
}

function showTodayButton()
{
  let todayButton = document.getElementById('today');

  let currentDate = new Date();
  
  if (time.getDate() === currentDate.getDate()
      && time.getMonth() === currentDate.getMonth()
      && time.getFullYear() === currentDate.getFullYear())
  {
    todayButton.style.display = "none";
    return;
  }
  todayButton.removeAttribute("style");
}

function deleteTiming (id) {
  var container = loadTimings(time);
  if (container === undefined) {
    return;
  }

  container.deleteDataSet(id);

  var writer = new TimeFileManager(remote.app.getPath('userData'), time);
  writer.saveFile(container.getWritable());

  var timeStr = String(time.getTime());
  cookiesManager.setCookie('time', timeStr);
  Window.reload();
}

function endTiming (id) {
  console.log(time);
  let container = loadTimings(time);
  let writer = new TimeFileManager(remote.app.getPath('userData'), time);
  let dataSet = writer.loadFileByTime(time).getTimeById(id);

  
  let newDataSet = new TimeDataSet();
  let startTime = new Date(dataSet.getRawStartTime());
  newDataSet.setStartTime(startTime)
  newDataSet.setDescription(dataSet.getDescription());
  newDataSet.setEndTime(new Date());

  container.deleteDataSet(id);
  container.addTime(newDataSet);
  console.log(container.getWritable());
  console.log(time);
  writer.saveFile(container.getWritable());
  fillTable();
}

function loadTimings (dateTime) {
  var folder = remote.app.getPath('userData');
  var manager = new TimeFileManager(folder, dateTime);
  return manager.loadTodayFile();
}

function getDifference (value) {
  var minutes = Math.floor((value / (1000 * 60)) % 60);
  var hours = Math.floor((value / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? '0' + hours : hours;
  minutes = (minutes < 10) ? '0' + minutes : minutes;

  return hours + ' h ' + minutes + ' m';
}
