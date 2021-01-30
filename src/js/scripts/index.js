const electron = require('electron');
const remote = electron.remote;
const Modal = require('../classes/electron_extension/Modal.js');
const Window = electron.remote.getCurrentWindow();
const TimeFileManager = require('../classes/data_management/TimeFileManager.js');
const TimeDataSet  = require('../classes/data_management/TimeDataSet.js');
const CookieManager = require('../classes/data_management/Cookies.js');
const SettingsManager = require('./../classes/settings/SettingsManager.js')
const LanguageManager = require('./../classes/translation/LanguageManager.js');
const DateFormatter = require("./../classes/util/DateFormatter.js");
const ProjectManager = require('./../classes/data_management/ProjectManagement/ProjectManager');
const ThemeSwitcher = require('../classes/theme/ThemeSwitcher');

ThemeSwitcher.useDarkMode(remote.nativeTheme.shouldUseDarkColors);
ThemeSwitcher.applyMode(document);

var time = new Date();

var cookiesManager = new CookieManager(electron);
var settingsFolder = remote.app.getPath('userData')
var settingsManager = new SettingsManager(settingsFolder);
var languageManager = new LanguageManager(remote.app.getAppPath() + "/language");
var projectManager = new ProjectManager(remote.app.getPath('userData'));
var timeManager = null;
var isDebug = false;
var addTimeModalWidth = 600;
var addTimeModalHeight = 250;
var selectedProject;

document.addEventListener('DOMContentLoaded', function () {
  Window.closeDevTools();
  console.log(projectManager);
  let settings = settingsManager.load("mainSettings");
  selectedProject = settings.getSetting("project");
  selectedProject = selectedProject === null ? 'default' : selectedProject;
  if (projectManager.getProjectByFolder(selectedProject) === undefined) {
    selectedProject = 'default';
  }
  let language = settings.getSetting("language");
  if (language !== null) {
    languageManager.setLanguage(language);
  }
  languageManager.applyTranslation(document);
  DateFormatter.setFormat(settings.getSetting("dateFormat"))
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
  createTimeManagerInstance();


  fillProjectSelection();
  addListener();
  fillTable();
}, false);

/**
 * Fill the project selection on page top
 */
function fillProjectSelection() {
  let selection = document.getElementById('projectSelect');
  let selectionGroup = document.getElementById('projectSelectionRow');

  projectManager.reloadProjects();
  let projects = projectManager.getProjects();
  if (projects === null || projects === undefined) {
    return;
  }
  
  if (projects.length === 1) {
    selectionGroup.setAttribute('hidden', 'true');
    return;
  }
  selectionGroup.removeAttribute('hidden');
  projects.forEach(project => {
    let option = document.createElement('option');
    option.innerHTML = project.getName();
    option.setAttribute('value', project.getId());
    option.setAttribute('data-folder', project.getFolder());
    if (project.getFolder() === selectedProject) {
      option.setAttribute('selected', true);
    }
    selection.append(option);
  })
}

/**
 * Create a new instance of the time manager
 */
function createTimeManagerInstance() {
  timeManager = new TimeFileManager(remote.app.getPath('userData'), selectedProject, time);
}

/**
 * Add all the liseners
 */
function addListener () {
  let todayButton = document.getElementById('today');
  let leftTimeButton = document.getElementById('goLeft');
  let rightTimeButton = document.getElementById('goRight');
  let projectSelect = document.getElementById('projectSelect');

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

  projectSelect.addEventListener('change', item => {
    let target = item.target;
    let id = target.value;
    let project = projectManager.getProjectById(id);
    
    let settings = settingsManager.load('mainSettings');
    selectedProject = project.getFolder();
    settings.addSetting('project', selectedProject);
    settingsManager.save('mainSettings', settings.getWritable());
    createTimeManagerInstance();
    console.log(timeManager);
    fillTable();
  })
}

/**
 * Fill out the table with the time data sets
 */
function fillTable () {
  showTodayButton();
  var tableBody = document.getElementById('tableBody');
  var date = document.getElementById('currentDate');
  date.innerHTML = ": " + DateFormatter.getHumanReadable(time);
  tableBody.innerHTML = '';

  var container = loadTimings(time);
  console.log(time);
  console.log(container);

  if (container === null) {
    return;
  }
  var times = container.getTimes();

  var index = 0;
  times.forEach(function (element) {
    var row = document.createElement('tr');
    var cell = document.createElement('td');
    let checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('class', 'form-check-input');
    if (!element.isGettingCounted()) {
      checkbox.setAttribute('checked', true);
    }
    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('disabled', 'true');
    cell.appendChild(checkbox);
    row.appendChild(cell);

    
    var timeBookedCell = document.createElement('td');
    let timeBookedCheckbox = document.createElement('input');
    timeBookedCheckbox.setAttribute('type', 'checkbox');
    timeBookedCheckbox.setAttribute('class', 'form-check-input');
    timeBookedCheckbox.setAttribute('data-id', index);
    let enabled = true;
    if (element.getEndTime() === "" || !element.isGettingCounted()) {
      timeBookedCheckbox.setAttribute('disabled', 'true');
      enabled = false;
    }
    if (enabled && element.isAlreadyBooked() && element.isGettingCounted()) {
      timeBookedCheckbox.setAttribute('checked', true);
    }
    timeBookedCheckbox.addEventListener('change', (checkbox) => {
      let target = checkbox.target;
      let checked = target.checked;
      let id = target.dataset.id;
      element.setTimeBooked(checked);
      let newDataset = new TimeDataSet();
      newDataset.setStartTime(element.getStartDate());
      newDataset.setEndTime(element.getEndDate());
      newDataset.setDescription(element.getDescription());
      newDataset.setTimeIngnored(!element.isGettingCounted());
      newDataset.setTimeBooked(checked);
      updateTimeData(id, newDataset)
    })
    timeBookedCell.appendChild(timeBookedCheckbox);
    row.appendChild(timeBookedCell);


    var cell = document.createElement('td');
    cell.textContent = element.getStartTime();
    row.appendChild(cell);

    cell = document.createElement('td');
    cell.textContent = element.getEndTime();
    row.appendChild(cell);

    cell = document.createElement('td');
    cell.textContent = element.getDescription();
    row.appendChild(cell);

    cell = document.createElement('td');
    cell.textContent = element.getFormatedTime();
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
    

    if (element.getEndTime() == "")
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
  endCell.setAttribute('colspan', '4');
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

/**
 * Show the today button or hide it if not needed
 */
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

/**
 * Delete a timing by the given id
 * @param {Int32Array} id 
 */
function deleteTiming (id) {
  var container = loadTimings(time);
  if (container === undefined) {
    return;
  }

  container.deleteDataSet(id);
  timeManager.saveFile(container.getWritable());

  var timeStr = String(time.getTime());
  cookiesManager.setCookie('time', timeStr);
  fillTable();
}

/**
 * End the timing for this block
 * @param {Int32Array} id 
 */
function endTiming (id) {
  console.log(time);
  let container = loadTimings(time);
  let dataSet = timeManager.loadFileByTime(time).getTimeById(id);

  
  let newDataSet = new TimeDataSet();
  let startTime = new Date(dataSet.getRawStartTime());
  newDataSet.setStartTime(startTime)
  newDataSet.setDescription(dataSet.getDescription());
  newDataSet.setEndTime(new Date());

  container.deleteDataSet(id);
  container.addTime(newDataSet);
  console.log(container.getWritable());
  console.log(time);
  timeManager.saveFile(container.getWritable());
  fillTable();
}

/**
 * Load the timings for the current date
 * @param {Date} dateTime 
 * @returns {TimeContainer}
 */
function loadTimings (dateTime) {
  return timeManager.loadFileByTime(dateTime);
}

/**
 * Update the time data
 * @param {Int32Array} id 
 * @param {TimeContainer} newTimeData 
 */
function updateTimeData(id, newTimeData) {
  deleteTiming(id);
  var container = loadTimings(time);
  container.addTime(newTimeData);
  timeManager.saveFile(container.getWritable());
  fillTable();
}

/**
 * Get the difference between
 * @param {Int32Array} value 
 */
function getDifference (value) {
  var minutes = Math.floor((value / (1000 * 60)) % 60);
  var hours = Math.floor((value / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? '0' + hours : hours;
  minutes = (minutes < 10) ? '0' + minutes : minutes;

  return hours + ' h ' + minutes + ' m';
}
