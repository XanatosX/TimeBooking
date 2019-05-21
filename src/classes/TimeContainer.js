class TimeContainer {
  constructor () {
    this.startTimes = []
    this.endTimes = []
  }

  addTime (datetime) {
    if (this.startTimes.lenght > this.endTimes.lenght) {
      this.addEndTime(datetime)
      return
    }
    this.addStartTime(datetime)
  }

  addStartTime (datetime) {
    this.startTimes.push(datetime)
  }

  addEndTime (datetime) {
    this.endTimes.push(datetime)
  }

  getWritable () {
    var json = {}
    json['startTimes'] = this.startTimes
    json['endTimes'] = this.endTimes
    return JSON.stringify(json)
  }

  getWorkTime () {
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
