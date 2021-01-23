const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const TimeFileManager = require('./../js/classes/data_management/TimeFileManager.js');
const TimeContainer = require('./../js/classes/data_management/TimeContainer.js');
const TimeDataSet = require('./../js/classes/data_management/TimeDataSet.js');
const LanguageManager = require('./../js/classes/translation/LanguageManager.js');
const SettingsManager = require('./../js/classes/settings/SettingsManager.js')
const remote = electron.remote;

var today = null;
var id = null;
var edit = false;
var settingsFolder = remote.app.getPath('userData')
var settingsManager = new SettingsManager(settingsFolder);
var languageManager = new LanguageManager(remote.app.getAppPath() + "/language");
var selectedProject;

ipcRenderer.on('time', (event, message) => {
  today = new Date(message);
  var timeInput = document.getElementById('start-timestamp');
  setTime(timeInput, today);
});

ipcRenderer.on('id', (event, message) => {
  id = message;
});

ipcRenderer.on('edit', (event, message) => {
  console.log(message);
  edit = true;
  var startInput = document.getElementById('start-timestamp');
  var endInput = document.getElementById('end-timestamp');
  var ignoreTime = document.getElementById('ignoreTime');
  var description = document.getElementById('description');

  var startTime = new Date(message.startTime);
  today = startTime;
  var endTime = new Date(message.endTime);
  if (message.timeIngored) {
    ignoreTime.setAttribute('checked', true);
  }
  

  setTime(startInput, startTime);
  setTime(endInput, endTime);
  description.value = message.description;
});

document.addEventListener('DOMContentLoaded', function () {
  let description = document.getElementById('description');
  
  let settings = settingsManager.load("mainSettings");
  selectedProject = settings.getSetting("project");
  selectedProject = selectedProject === null ? 'default' : selectedProject;
  let language = settings.getSetting("language");
  if (language !== null) {
    languageManager.setLanguage(language);
  }
  languageManager.applyTranslation(document);
  description.setAttribute('placeholder', languageManager.getTranslation('descriptionPlaceholder'));
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
  let ignoreTime = document.getElementById('ignoreTime');
  var folder = remote.app.getPath('userData');
  var manager = new TimeFileManager(folder, selectedProject, today);
  var container = manager.loadTodayFile();
  if (container === null) {
    container = new TimeContainer();
  }

  var newDataSet = new TimeDataSet();
  let timeIngored = ignoreTime.checked;

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
  newDataSet.setTimeIngnored(timeIngored);

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
