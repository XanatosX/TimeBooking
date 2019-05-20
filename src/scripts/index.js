const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;



document.addEventListener('DOMContentLoaded', function () {
  addListner();
}, false);

function addListner() {
  var addTimeButton = document.getElementById('addStartTime');
  addTimeButton.addEventListener('click', function (event) {
      const modalPath = path.join('file://', __dirname, '../windows/addTime.html');
      let win = new BrowserWindow({
        //frame: false,
        width: 400,
        height: 200
      });
      win.on('close', function () {
         win = null;
       })
      win.loadURL(modalPath);
      win.show();
  })
};
