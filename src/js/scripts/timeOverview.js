const TableManager = require('./../classes/TableManager.js');
const TimeFileManager = require('./../classes/TimeFileManager.js');
const TimeContainer = require('./../classes/TimeContainer.js');
const SettingsManager = require('./../classes/SettingsManager.js');
const { remote } = require('electron');
const LanguageManager = require('./../classes/translation/LanguageManager.js');

var timeManager;
var settingsManager;
var settings;
var manager;
var settingsFolder = remote.app.getPath('userData')
var languageManager = new LanguageManager("./language");

document.addEventListener('DOMContentLoaded', function () {
    
    settingsManager = new SettingsManager(settingsFolder);
    settings = settingsManager.load("mainSettings");
    let language = settings.getSetting("language");
    if (language !== null) {
      languageManager.setLanguage(language);
    }
    languageManager.applyTranslation(document);

    let current = new Date(Date.now());
    manager = new TableManager('tableContainer');

    timeManager = new TimeFileManager(settingsFolder, current);
    let files = timeManager.getFiles();
    
    addEvents();
    createWeeklyDataTable();
  }, false);

  function addEvents() {
    let weekButton = document.getElementById('showWeekTime');
    let closeButton = document.getElementById('closeWindow');
    let showAllCheckbox = document.getElementById('showAll');
    let showWorkdaysCheckbox = document.getElementById('showWorkdays');


    weekButton.addEventListener('click', createWeeklyDataTable);
    closeButton.addEventListener('click', function () {
        window.close();
    });

    showAllCheckbox.addEventListener('click', function () {
        //@TODO: Add other methods for month and year
        createWeeklyDataTable();
    });

    showWorkdaysCheckbox.addEventListener('click', function () {
        //@TODO: Add other methods for month and year
        createWeeklyDataTable();
    });
  }

  function createWeeklyDataTable() {
    manager.setHeadline({
        0: {
            name: languageManager.getTranslation("date")
        },
        1: {
            name: languageManager.getTranslation("workedTime")
        }
    });

    let timings = getTimings(getPreviousMonday(new Date(Date.now())), getNextSunday(new Date(Date.now())));

    manager.clearRows();
    let totalTiming = 0;
    for (let key in timings) {
        let currentTimings = timings[key];
        let date = currentTimings['date'];
        let timingVal = currentTimings['timings'].getCompleteWorkTime();
        totalTiming += timingVal;
        manager.addRow({
            0: {
                name: date
            },
            1: {
                name: toHumanReadable(timingVal)
            }
        });
    }

    manager.addRow({
        0: {
            name: languageManager.getTranslation("totalWorktime")
        },
        1: {
            name: toHumanReadable(totalTiming) + " / " + getWorkingHours(getPreviousMonday(new Date(Date.now())), getNextSunday(new Date(Date.now()))) + " h"
        }
    });
  }

  function getPreviousMonday(date) {
    let day = date.getDay();
    let returnValue = date;
    if (day !== 1) {
        returnValue = new Date().setDate(date.getDate() - day);
        returnValue = new Date(returnValue);
    }
    return returnValue;
  }

  function getNextSunday(date) {
    
    let day = date.getDay();
    let returnValue = date;

    if (day !== 0) {
        returnValue = new Date().setDate(date.getDate() + (7 - day));
        returnValue = new Date(returnValue);
    }

    return returnValue;
  }

  function getAllowedDays () {
        let showAll = getOverrideValue();
        let returnDays = [];
        if (showAll || settings.getSetting('sunday')) {
            returnDays.push(0);
        }
        if (showAll || settings.getSetting('monday')) {
            returnDays.push(1);
        }
        if (showAll || settings.getSetting('tuesday')) {
            returnDays.push(2);
        }
        if (showAll || settings.getSetting('wednesday')) {
            returnDays.push(3);
        }
        if (showAll || settings.getSetting('thursday')) {
            returnDays.push(4);
        }
        if (showAll || settings.getSetting('friday')) {
            returnDays.push(5);
        }
        if (showAll || settings.getSetting('saturday')) {
            returnDays.push(6);
        }

        return returnDays;
  }

  function getDaysToCount (firstDate, lastDate) {
    let diffTime = Math.abs(lastDate.getTime() - firstDate.getTime());
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    return diffDays;
  }

  /**
   * Check of we override the days
   */
  function getOverrideValue()
  {
    let showAllCheckbox = document.getElementById('showAll');
    return showAllCheckbox.checked;
  }

  /**
   * 
   * @param {Date} firstDate 
   */
  function getTimings(firstDate, lastDate) {
    let allowedDays = getAllowedDays();
    let datesToLoad = [];
    let TimesToReturn = {};

    let diffDays = getDaysToCount(firstDate, lastDate);

    for (let i = 0; i < diffDays; i++) {
        let currentDay = new Date().setDate(firstDate.getDate() + i);
        let currentDate = new Date(currentDay);

        if (allowedDays.includes(currentDate.getDay())) {
            datesToLoad.push(currentDate.getTime());
        }
    }

    for (let key in datesToLoad) {
        let dataSet = datesToLoad[key];
        let fileDate = new Date(dataSet);

        let content = timeManager.loadFile(getFileNameFromDate(fileDate));
        if (content === null) {
            content = new TimeContainer();
        }
        let object = {
            'date': getReadableDate(fileDate),
            'timings': content
        };
        TimesToReturn[key] = object;
    }
    return TimesToReturn;
  }

  function getWorkingHours (firstDate, lastDate) {
      let allowedDays = getAllowedDays();
      let daysToCount = getDaysToCount(firstDate, lastDate);

      let workingHours = 0;

      for (let i = 0; i < daysToCount; i++) {
        let currentDay = new Date().setDate(firstDate.getDate() + i);
        let currentDate = new Date(currentDay);

        if (allowedDays.includes(currentDate.getDay())) {
            if (settings.getSetting('dailyWork') !== null)
            {
                workingHours += parseFloat(settings.getSetting('dailyWork'));
            }
        }
      }

      return workingHours;

  }

  function toHumanReadable (workTime) {
    workTime = workTime / 1000;
    workTime = workTime / 60;
    
    let hours = (workTime / 60);
    let realHours = Math.floor(hours);
    let minutes = (hours - realHours) * 60;
    let realMinutes = Math.round(minutes);

  return realHours + " h " + realMinutes + " m";
  }

  function getFileNameFromDate (date) {
      return date.getFullYear() + String(date.getMonth() + 1).padStart(2, '0') + String(date.getDate()).padStart(2, '0');
  }

  function getReadableDate (date) {
      let year = date.getFullYear();
      let month = String(date.getMonth() + 1).padStart(2, '0');
      let day = String(date.getDate() + 1).padStart(2, '0');
      return month + ' / ' + day + ' / ' + year;
  }
  