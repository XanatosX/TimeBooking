const electron = require('electron');
const path = require('path');
const remote = electron.remote

document.addEventListener('DOMContentLoaded', function () {
  addListner();
}, false);

function addListner() {
  var closeBtn = document.getElementById('closeButton');
  closeBtn.addEventListener('click', function (event) {
      var window = remote.getCurrentWindow();
      window.close();
  })
};
