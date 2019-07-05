const TimeDataSet = require('./TimeDataSet.js');

/**
 * This class contains different time data sets
 */
class TimeContainer {

  /**
   * This is the constructor of the class and will create an empty instance
   */
  constructor () {
    this.times = [];
  }

  /**
   * This function will add a new time to the collection
   * @param  {TimeDataSet} data
   */
  addTime (data) {
    this.times.push(data);
  }

  /**
   * This method will return you all the times in the container
   */
  getTimes () {
    return this.times;
  }

  /**
   * This method will delete a dataset at position x
   * @param  {Int32Array id
   */
  deleteDataSet (id) {
    this.times.splice(id, 1);
  }

  /**
   * This method will return you the current container as saveable String
   */
  getWritable () {
    let json = {};
    let timingArray = [];
    this.times.forEach(function (item) {
      timingArray.push(item.getSaveableDataSet());
    });
    json['timings'] = timingArray;
    return JSON.stringify(json);
  }

  /**
   * This method will return you the whole working time for this container
   */
  getCompleteWorkTime () {
    if (this.times.length === 0) {
      return 0;
    }

    let passed = 0;
    this.times.forEach(function (item) {
      passed += item.getWorkTime();
    });

    return passed;
  }

  /**
   * This method will fill the content of this instance with the data of the object
   * @param {Object} data
   */
  fromJson (data) {
    if (data.timings === undefined) {
      return;
    }

    data.timings.forEach(function (item) {
      var timestamp = new TimeDataSet();
      timestamp.fromJson(item);
      this.times.push(timestamp);
    }.bind(this));

    this.times.sort((a, b) => parseInt(a.startTime) - parseInt(b.startTime));
  }
}

module.exports = TimeContainer;