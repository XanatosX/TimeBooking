/**
 * This class contains a single start and end date
 */
class TimeDataSet {

  /**
   * This constructor will create you an empty instance
   */
  constructor () {
    this.startTime = null;
    this.endTime = null;
    this.timeIngored = null;
    this.setTimeIngnored(false);
    this.description = '';
  }

  /**
   * This method will set the description of this instance
   * 
   * @param  {String} data
   */
  setDescription (data) {
    this.description = data;
  }

  /**
   * This function will return you the description
   */
  getDescription () {
    return this.description;
  }

  /**
   * Should we ignore the entry?
   * @param {boolean} isIgnored 
   */
  setTimeIngnored(isIgnored) {
    this.timeIngored = isIgnored;
  }

  /**
   * Should the dataset be counted
   */
  isGettingCounted() {
    return (!this.timeIngored);
  }

  /**
   * This method will return you a human readable version of you date
   * 
   * @param  {Int32Array} value
   */
  convertToTime (value) {
    if (value === null) {
      return '';
    }
    let date = new Date(value);
    let time = String(date.getHours()).padStart(2, '0') + ':';
    time += String(date.getMinutes()).padStart(2, '0');

    return time;
  }

  /**
   * This method will set the start date for this container
   * 
   * @param  {Date} dateTime;
   */
  setStartTime (dateTime) {
    this.startTime = dateTime.getTime();
  }

  /**
  * This method will get you the raw start date of this container
  */
  getRawStartTime () {
    return this.startTime;
  }

  /**
   * This method will get you the start date of this container
   */
  getStartTime () {
    return this.convertToTime(this.startTime);
  }

  /**
  * This method will get you the raw end date of this container
  */
  getRawEndTime () {
  return this.endTime;
  }

  /**
   * This method will set the end date for this container
   * @param  {Date} dateTime
   */
  setEndTime (dateTime) {
    this.endTime = dateTime.getTime();
  }

  /**
   * This method will return you the current end time set in the container
   */
  getEndTime () {
    return this.convertToTime(this.endTime);
  }

  /**
   * This method will return you the work time for this data set
   */
  getWorkTime () {
    var returnInt = 0;

    if (this.startTime === null || this.endTime === null) {
      return returnInt;
    }

    returnInt = this.endTime - this.startTime;

    return returnInt;
  }

  /**
   * This method will return you a well formated time ready to display
   */
  getFormatedTime () {
    let returnString = '';
    let value = this.getWorkTime();
    let minutes = Math.floor((value / (1000 * 60)) % 60);
    let hours = Math.floor((value / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;

    returnString = hours + ' h ' + minutes + ' m';
    return returnString;
  }

  /**
   * This method will get you a saveable dataset as object
   */
  getSaveableDataSet () {
    var data = {};
    data['startTime'] = this.startTime;
    data['endTime'] = this.endTime;
    data['counted'] = this.isGettingCounted();
    data['description'] = this.description;

    return data;
  }
  /**
   * This method will fill this container with the data of an object
   * 
   * @param  {Object} data
   */
  fromJson (data) {
    if (data.startTime === undefined || data.endTime === undefined) {
      return;
    }

    this.startTime = data.startTime;
    this.endTime = data.endTime;
    if (data.counted !== undefined) {
      this.setTimeIngnored(!data.counted);
    }
    if (data.description !== undefined) {
      this.description = data.description;
    }
  }
}

module.exports = TimeDataSet;
