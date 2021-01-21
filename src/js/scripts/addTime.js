const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const TimeFileManager = require('./../js/classes/TimeFileManager.js');
const TimeContainer = require('./../js/classes/TimeContainer.js');
const TimeDataSet = require('./../js/classes/TimeDataSet.js');
const LanguageManager = require('./../js/classes/translation/LanguageManager.js');
const SettingsManager = require('./../js/classes/SettingsManager.js')
const remote = electron.remote;

var today = null;
var id = null;
var edit = false;
var settingsFolder = remote.app.getPath('userData')
var settingsManager = new SettingsManager(settingsFolder);
var languageManager = new LanguageManager(remote.app.getAppPath() + "/language");

ipcRenderer.on('time', (event, message) => {
  today = new Date(message);
  var timeInput = document.getElementById('start-timestamp');
  setTime(timeInput, today);
});

ipcRenderer.on('id', (event, message) => {
  id = message;
});

ipcRenderer.on('edit', (event, message) => {
  edit = true;
  var startInput = document.getElementById('start-timestamp');
  var endInput = document.getElementById('end-timestamp');
  var description = document.getElementById('description');

  var startTime = new Date(message.startTime);
  today = startTime;
  var endTime = new Date(message.endTime);

  setTime(startInput, startTime);
  setTime(endInput, endTime);
  description.value = message.description;
});

document.addEventListener('DOMContentLoaded', function () {
  
  let settings = settingsManager.load("mainSettings");
  let language = settings.getSetting("language");
  if (language !== null) {
    languageManager.setLanguage(language);
  }
  languageManager.applyTranslation(document);
  addListener();
  addKeyPress();
}, false);

function setTime (element, timeInput) {
  var time = String(timeInput.getHours()).padStart(2, '0') + ':' + String(timeInput.getMinutes()).padStart(2, '0');
  element.value = time;
}

function addKeyPress () {
  window.addEventListener('keyup', KeyUp, true);
}

function KeyUp (event) {
  if (event.keyCode === 27) {
    close();
  }
  if (event.keyCode === 13) {
    save();
  }
}

function addListener () {
  var closeBtn = document.getElementById('closeButton');
  var saveBtn = document.getElementById('saveButton');
  closeBtn.addEventListener('click', function (event) {
    close();
  });
  saveBtn.addEventListener('click', function (event) {
    save();
  });
}

function close () {
  var window = remote.getCurrentWindow();
  window.close();
}

function save () {
  var timeStart = document.getElementById('start-timestamp');
  var timeEnd = document.getElementById('end-timestamp');
  var description = document.getElementById('description');
  var folder = remote.app.getPath('userData');
  var manager = new TimeFileManager(folder, today);
  var container = manager.loadTodayFile();
  if (container === null) {
    container = new TimeContainer();
  }

  var newDataSet = new TimeDataSet();

  if (timeStart.value === undefined) {
    return;
  }

  var endTime = null;
  var startTime = 'T' + timeStart.value + ':00';
  if (timeEnd.value !== undefined) {
    endTime = 'T' + timeEnd.value + ':00';
  }

  var date = String(today.getFullYear()) + '-';
  date += String(today.getMonth() + 1).padStart(2, '0') + '-';
  date += String(today.getDate()).padStart(2, '0');
  var startStamp = new Date(date + startTime);
  var endStamp = new Date(date + endTime);
  newDataSet.setStartTime(startStamp);
  if (endStamp !== null) {
    newDataSet.setEndTime(endStamp);
  }
  newDataSet.setDescription(description.value);

  if (edit) {
    if (id === null) {
      console.log('Missing id');
      return;
    }
    container.deleteDataSet(id);
  }
  container.addTime(newDataSet);
  manager.saveFile(container.getWritable());

  close();
}
