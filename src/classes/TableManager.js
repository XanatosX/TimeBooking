/**
 * This class will allow you to fill a table tag with content
 */
class TableManager {
    
    /**
     * This constructor will build a new TableManager
     * @param  {String} tableId The id of the table to search
     */
    constructor (tableId) {
        this.table = document.getElementById(tableId)
        this.columns = 0

        let header = document.createElement('thead')
        header.setAttribute('id', tableId + '_header')
        this._headerContainer = this.table.appendChild(header)
        let body = document.createElement('thead')
        body.setAttribute('id', tableId + '_body')
        this._headerBody = this.table.appendChild(body)
    }

    /**
     * This method will set the headline for this table
     * @param  {Object} json
     */
    setHeadline (json) {
        this._headerContainer.innerHTML = ''
        this.columns = 0
        let row = document.createElement('tr')
        for (let key in json) {
            let element = json[key]
            let headline = document.createElement('th')
            let name = element.name
            headline.innerHTML = name

            let id = element.id
            if (id !== undefined) {
                headline.setAttribute('id', id)
            }
            let classes = element.class
            if (classes !== undefined) {
                headline.setAttribute('class', classes)
            }
            this.columns++
            row.appendChild(headline)
        }
        this._headerContainer.appendChild(row)
    }

    /**
     * This method will add a new row to the table
     * @param {Object} json 
     */
    addRow (json) {
        let row = document.createElement('tr')
        let rowColumns = 0
        let returnValue = false

        for (let key in json) {
            let element = json[key]
            let content = document.createElement('td')
            let name = element.name

            content.innerHTML = name
            let colspan = element.colspan
            if (colspan !== undefined) {
                content.setAttribute('colspan', colspan)
                rowColumns += colspan
            } else {
                rowColumns++
            }

            row.appendChild(content)
        }

        if (rowColumns === this.columns) {
            this._headerBody.appendChild(row)
            returnValue = true
        }
        return returnValue
    }

    /**
     * This method will delete all rows
     */
    clearRows () {
        this._headerBody.innerHTML = ''
    }
}

module.exports = TableManager