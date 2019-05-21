const TimeDataSet = require('./TimeDataSet.js')

class TimeContainer {
  constructor () {
    this.startTimes = []
    this.endTimes = []
    this.times = []
  }

  addTime (datetime) {
    if (this.startTimes.length > this.endTimes.length) {
      this.addEndTime(datetime)
      return
    }
    this.addStartTime(datetime)
  }

  addTime (data) {
    this.times.push(data)
  }

  getTimes () {
    return this.times
  }

  getWritable () {
    var json = {}
    this.times.forEach(function (item) {
      json['timings'] = item
    })
    return JSON.stringify(json)
  }

  fromJson (json) {
  }

  getCompleteWorkTime () {
    if (this.times.lenght === 0) {
      return 0
    }

    var passed = 0
    this.times.forEach(function (item) {
      passed += item.getWorkTime()
    })

    return passed
  }

  fromJson (data) {
    if (data.timings === undefined) {
      return
    }

    data.timings.forEach(function (item) {
      var timestamp = new TimeDataSet();
      timestamp.fromJson(item)
    })
  }
}

module.exports = TimeContainer
