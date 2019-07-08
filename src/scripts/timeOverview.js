const TableManager = require('../classes/TableManager.js');
const TimeFileManager = require('../classes/TimeFileManager.js');
const TimeContainer = require('../classes/TimeContainer.js');
const SettingsManager = require('../classes/SettingsManager.js');
const { remote } = require('electron');

var timeManager;
var settingsManager;
var settings;
var manager;

document.addEventListener('DOMContentLoaded', function () {
    let folder = remote.app.getPath('userData');
    let current = new Date(Date.now());
    manager = new TableManager('tableContainer');

    settingsManager = new SettingsManager(folder);
    settings = settingsManager.load("mainSettings");
    timeManager = new TimeFileManager(folder, current);
    let files = timeManager.getFiles();
    
    addEvents();
  }, false);

  function addEvents() {
    let weekButton = document.getElementById('showWeekTime');
    weekButton.addEventListener('click', function () {
        manager.setHeadline({
            0: {
                name: 'Date'
            },
            1: {
                name: "Worked time"
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
                name: 'In Total: '
            },
            1: {
                name: toHumanReadable(totalTiming) + " / " + getWorkingHours(getPreviousMonday(new Date(Date.now())), getNextSunday(new Date(Date.now()))) + " h"
            }
        });
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
        let returnDays = [];
        if (settings.getSetting('sunday')) {
            returnDays.push(0);
        }
        if (settings.getSetting('monday')) {
            returnDays.push(1);
        }
        if (settings.getSetting('tuesday')) {
            returnDays.push(2);
        }
        if (settings.getSetting('wednesday')) {
            returnDays.push(3);
        }
        if (settings.getSetting('thursday')) {
            returnDays.push(4);
        }
        if (settings.getSetting('friday')) {
            returnDays.push(5);
        }
        if (settings.getSetting('saturday')) {
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
            workingHours += parseFloat(settings.getSetting('dailyWork'));
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
  