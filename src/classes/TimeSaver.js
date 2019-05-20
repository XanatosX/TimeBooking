class TimeSaver {

  constructor(path) {
    this.path = path;
    this.startTimes = [];
    this.endTimes = [];
  }

  addStartTime(datetime) {
    this.startTimes.push(datetime);
  }

  addEndTime(datetime) {
    this.endTimes.push(datetime);
  }

  getWorkTime() {
    if (this.endTimes.lenght !== this.startTimes.lenght) {
      return 0;
    }

    var passed = 0;
    for (var i = 0; i < this.startTimes.length; i++) {
      var startTime = this.startTimes[i];
      var endTime = this.endTimes[i];

      passed += endTime - startTime;
    }

    return passed;
  }

}

module.exports = TimeSaver;
