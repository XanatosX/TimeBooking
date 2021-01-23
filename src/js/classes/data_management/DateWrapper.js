/**
 * This class will extend the default date class from java
 */
class DateWrapper {

    /**
     * Create a new instance of this class
     * @param {Date} date 
     */
    constructor(date)
    {
        this.date = date;
        this.dayLookup = [];
        this.dayLookup.push("Monday");
    }

    /**
     * returns the raw date
     */
    getDate() {
        return this.date;
    }

    getDay() {

    }
}

module.exports = DateWrapper;