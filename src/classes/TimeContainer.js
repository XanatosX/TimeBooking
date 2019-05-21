class TimeContainer {
  constructor () {
    this.startTimes = []
    this.endTimes = []
  }

  addTime (datetime) {
    if (this.startTimes.length > this.endTimes.length) {
      this.addEndTime(datetime)
      return
    }
    this.addStartTime(datetime)
  }

  addStartTime (datetime) {
    if (datetime === '') {
      return
    }
    this.startTimes.push(datetime.getTime())
  }

  getTimes () {
    var times = []
    for (var i = 0; i < this.startTimes.length; i++) {
      times.push(this.startTimes[i])
      times.push(this.endTimes[i])
    }
    return times
  }

  addEndTime (datetime) {
    if (datetime === '') {
      return
    }
    this.endTimes.push(datetime.getTime())
  }

  getWritable () {
    var json = {}
    json['startTimes'] = this.startTimes
    json['endTimes'] = this.endTimes
    return JSON.stringify(json)
  }

  fromJson (json) {
    json['startTimes'].forEach(function (datetime) {
      this.startTimes.push(datetime)
    }.bind(this))
    json['endTimes'].forEach(function (datetime) {
      this.endTimes.push(datetime)
    }.bind(this))
  }

  getWorkTimes () {
    var timings = []
    for (var i = 0; i < this.startTimes.length; i++) {
      var startTime = this.startTimes[i]
      var endTime = this.endTimes[i]
      console.log(startTime)
      if (endTime === undefined) {
        break
      }

      var diff = endTime - startTime
      timings.push(diff)
    }

    return timings
  }

  getCompleteWorkTime () {
    if (this.endTimes.lenght !== this.startTimes.lenght) {
      return 0
    }

    var passed = 0
    for (var i = 0; i < this.startTimes.length; i++) {
      var startTime = this.startTimes[i]
      var endTime = this.endTimes[i]

      passed += endTime - startTime
    }

    return passed
  }
}

module.exports = TimeContainer
