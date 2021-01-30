const TableManager = require('../classes/electron_extension/TableManager.js');
const TimeFileManager = require('../classes/data_management/TimeFileManager.js');
const TimeContainer = require('../classes/data_management/TimeContainer.js');
const SettingsManager = require('./../classes/settings/SettingsManager.js');
const LanguageManager = require('./../classes/translation/LanguageManager.js');
const DateFormatter = require("./../classes/util/DateFormatter.js");
const TimeFormatter = require("./../classes/util/TimeFormatter.js");
const { remote } = require('electron');
const ThemeSwitcher = require('../classes/theme/ThemeSwitcher');

ThemeSwitcher.useDarkMode(remote.nativeTheme.shouldUseDarkColors);
ThemeSwitcher.applyMode(document);

var timeManager;
var settingsManager;
var settings;
var manager;
var settingsFolder = remote.app.getPath('userData')
var languageManager = new LanguageManager(remote.app.getAppPath() + "/resources/language");

document.addEventListener('DOMContentLoaded', function () {
    settingsManager = new SettingsManager(settingsFolder);
    settings = settingsManager.load("mainSettings");
    let language = settings.getSetting("language");
    if (language !== null) {
      languageManager.setLanguage(language);
    }
    languageManager.applyTranslation(document);
    DateFormatter.setFormat(settings.getSetting("dateFormat"))
    DateFormatter.buildDayTable(languageManager);

    let current = new Date(Date.now());
    manager = new TableManager('tableContainer');
    let selectedProject = settings.getSetting("project");
    selectedProject = selectedProject === null ? 'default' : selectedProject;

    timeManager = new TimeFileManager(settingsFolder, selectedProject, current);
    
    addEvents();
    createWeeklyDataTable();
  }, false);

  /**
   * Add all the events
   */
  function addEvents() {
    let weekButton = document.getElementById('showWeekTime');
    let monthButton = document.getElementById('showMonthTime');
    let yearButton = document.getElementById('showYearTime');
    let allTimeButton = document.getElementById('showAllTime');
    let closeButton = document.getElementById('closeWindow');
    let showAllCheckbox = document.getElementById('showAll');
    let showWorkdaysCheckbox = document.getElementById('showWorkdays');

    monthButton.setAttribute('disabled', true);
    yearButton.setAttribute('disabled', true);
    allTimeButton.setAttribute('disabled', true);

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
        console.log(currentTimings);
        let date = DateFormatter.getTranslatedDate(currentTimings.rawDate);
        date += " " + currentTimings['date'];
        let timingVal = currentTimings['timings'].getCompleteWorkTime();
        totalTiming += timingVal;
        manager.addRow({
            0: {
                name: date
            },
            1: {
                name: TimeFormatter.toHumanReadable(timingVal)
            }
        });
    }

    manager.addRow({
        0: {
            name: languageManager.getTranslation("totalWorktime")
        },
        1: {
            name: TimeFormatter.toHumanReadable(totalTiming) + " / " + getWorkingHours(getPreviousMonday(new Date(Date.now())), getNextSunday(new Date(Date.now()))) + " h"
        }
    });
  }

  /**
   * Get the previous monday
   * @param {Date} date 
   */
  function getPreviousMonday(date) {
    let day = date.getDay() - 1;
    let returnValue = date;
    if (day !== 1) {
        returnValue = new Date().setDate(date.getDate() - day);
        returnValue = new Date(returnValue);
    }
    return returnValue;
  }

  /**
   * Get the next sunday
   * @param {Date} date 
   */
  function getNextSunday(date) {
    
    let day = date.getDay();
    let returnValue = date;

    if (day !== 0) {
        returnValue = new Date().setDate(date.getDate() + (7 - day));
        returnValue = new Date(returnValue);
    }
    return returnValue;
  }

  /**
   * Get all the allowed days
   */
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

  /**
   * Get all the dates we need to count for the overview
   * @param {Date} firstDate 
   * @param {Date} lastDate 
   */
  function getDaysToCount (firstDate, lastDate) {
    lastDate.setDate(lastDate.getDate() + 1);
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
   * Get all the timings
   * @param {Date} firstDate 
   * @param {Date} lastDate 
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

        let content = timeManager.loadFileByTime(fileDate);
        if (content === null) {
            content = new TimeContainer();
        }
        let object = {
            'rawDate': fileDate,
            'date': DateFormatter.getHumanReadable(fileDate),
            'timings': content
        };
        TimesToReturn[key] = object;
    }
    return TimesToReturn;
  }

  /**
   * Get the working hours
   * @param {Date} firstDate 
   * @param {Date} lastDate 
   */
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