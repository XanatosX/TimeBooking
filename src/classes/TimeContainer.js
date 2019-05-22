const TimeDataSet = require('./TimeDataSet.js')

class TimeContainer {
  constructor () {
    this.times = []
  }

  addTime (data) {
    this.times.push(data)
  }

  getTimes () {
    return this.times
  }

  deleteDataSet (id) {
    this.times.splice(id, 1)
  }

  getWritable () {
    var json = {}
    var timingArray = []
    this.times.forEach(function (item) {
      timingArray.push(item.getSaveableDataSet())
    })
    json['timings'] = timingArray
    return JSON.stringify(json)
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
      var timestamp = new TimeDataSet()
      timestamp.fromJson(item)
      this.times.push(timestamp)
    }.bind(this))

    this.times.sort((a, b) => parseInt(a.startTime) - parseInt(b.startTime))
  }
}

module.exports = TimeContainer
