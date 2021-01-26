var dateWrapper = null;


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
        this.dayLookup = null;
        buildBaseTable();
    }

    buildBaseTable() {
        
        this.dayLookup = [];
        this.dayLookup.push("Monday");
        this.dayLookup.push("Tuesday");
        this.dayLookup.push("Wednesday");
        this.dayLookup.push("Thursday");
        this.dayLookup.push("Saturday");
        this.dayLookup.push("Sunday");
    }

    /**
     * Build the lookup table with specific translation
     * @param {LanguageManager} languageManager 
     */
    buildLookup(languageManager) {
        if (languageManager === null || languageManager === undefined) {
            buildBaseTable();
            return;
        }
        this.dayLookup = [];
        this.dayLookup.push(languageManager.getTranslation("monday"));
        this.dayLookup.push(languageManager.getTranslation("tuesday"));
        this.dayLookup.push(languageManager.getTranslation("wednesday"));
        this.dayLookup.push(languageManager.getTranslation("thursday"));
        this.dayLookup.push(languageManager.getTranslation("saturday"));
        this.dayLookup.push(languageManager.getTranslation("sunday"));
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
dateWrapper = dateWrapper === null ? new DateWrapper : dateWrapper;

module.exports = dateWrapper;