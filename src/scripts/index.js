const electron = require('electron')
const Modal = require('../classes/Modal.js')
const Window = electron.remote.getCurrentWindow()

document.addEventListener('DOMContentLoaded', function () {
  addListner()
}, false)

function addListner () {
  var addTimeButton = document.getElementById('addStartTime')
  addTimeButton.addEventListener('click', function (event) {
    var addModal = new Modal(Window, 400, 200, 'addTime')
    addModal.show()
  })
};
