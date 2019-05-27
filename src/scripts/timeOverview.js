const TableManager = require('../classes/TableManager.js')

var manager

document.addEventListener('DOMContentLoaded', function () {
    manager = new TableManager('tableContainer')
    manager.setHeadline({
        "TestName": {
            id: "testId",
            class: "testClass"
        }
    })
  }, false)