class TableManager {
    
    /**
     * This constructor will build a new TableManager
     * @param  {String} tableId The id of the table to search
     */
    constructor (tableId) {
        this.table = document.getElementById(tableId)

        let header = document.createElement('thead')
        header.setAttribute('id', tableId + '_header')
        this._headerContainer = this.table.appendChild(header)
        let body = document.createElement('thead')
        body.setAttribute('id', tableId + '_body')
        this._headerBody = this.table.appendChild(body)
    }

    setHeadline (json) {
        this._headerContainer.innerHTML = ''
        let row = document.createElement('tr')
        for (let key in json) {
            let element = json[key]
            let headline = document.createElement('th')
            let name = key
            headline.innerHTML = name

            let id = element.id
            if (id !== undefined) {
                headline.setAttribute('id', id)
            }
            let classes = element.class
            if (classes !== undefined) {
                headline.setAttribute('class', classes)
            }
            row.appendChild(headline)
        }
        this._headerContainer.appendChild(row)
    }
}

module.exports = TableManager