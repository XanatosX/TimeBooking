const electron = require('electron');
const path = require('path');
const remote = electron.remote

document.addEventListener('DOMContentLoaded', function () {
  setTime();
  addListner();
}, false);

function setTime() {
  var timeInput = document.getElementById('timestamp');

  var today = new Date();
  var time = today.getHours() + ":" + today.getMinutes();
  timeInput.value = time;
}

function addListner() {
  var closeBtn = document.getElementById('closeButton');
  closeBtn.addEventListener('click', function (event) {
      var window = remote.getCurrentWindow();
      window.close();
  })
};
