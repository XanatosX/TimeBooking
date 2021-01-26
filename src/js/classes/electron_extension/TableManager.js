/**
 * This class will allow you to fill a table tag with content
 */
class TableManager {
    
    /**
     * This constructor will build a new TableManager
     * 
     * @param  {String} tableId The id of the table to search
     */
    constructor (tableId) {
        this.table = document.getElementById(tableId);
        this.tableId = tableId;
        this.columns = 0;
        this.headerContainer = null;
        this.headerBody = null;

        this.createTableParts();
    }

    /**
     * This method will set the headline for this table
     * 
     * @param  {Object} json
     */
    setHeadline (json) {
        this.headerContainer.innerHTML = '';
        this.columns = 0;
        let row = document.createElement('tr');
        for (let key in json) {
            let element = json[key];
            let headline = document.createElement('th');
            let name = element.name;
            headline.innerHTML = name;

            let id = element.id;
            if (id !== undefined) {
                headline.setAttribute('id', id);
            }
            let classes = element.class;
            if (classes !== undefined) {
                headline.setAttribute('class', classes);
            }
            this.columns++;
            row.appendChild(headline);
        }
        this.headerContainer.appendChild(row);
    }

    /**
     * This method will add a new row to the table
     * 
     * @param {Object} json 
     */
    addRow (json) {
        let row = document.createElement('tr');
        let rowColumns = 0;
        let returnValue = false;

        for (let key in json) {
            let element = json[key];
            
            let content = document.createElement('td');
            let name = element.name;
            if (element.data !== null && element.data !== undefined) {
                element.data.forEach(element => {
                    let name = "data-" + element.name;
                    let data = element.value;
                    row.setAttribute(name, data);
                });
            }

            content.innerHTML = name;
            let colspan = element.colspan;
            if (colspan !== undefined) {
                content.setAttribute('colspan', colspan);
                rowColumns += colspan;
            } else {
                rowColumns++;
            }

            row.appendChild(content);
        }

        if (rowColumns === this.columns) {
            this.headerBody.appendChild(row);
            returnValue = true;
        }
        return returnValue;
    }

    /**
     * Create the needed base parts of the table
     */
    createTableParts() {
        let header = document.createElement('thead');
        header.setAttribute('id', this.tableId + '_header');
        this.headerContainer = this.table.appendChild(header);
        let body = document.createElement('tbody');
        body.setAttribute('id', this.tableId + '_body');
        this.headerBody = this.table.appendChild(body);
    }

    /**
     * This method will delete all rows
     */
    clearRows () {
        this.headerBody.innerHTML = '';
    }

    /**
     * Clear the whole table
     */
    clearTable() {
        this.table.innerHTML = '';
        this.createTableParts();
    }
}

module.exports = TableManager;
