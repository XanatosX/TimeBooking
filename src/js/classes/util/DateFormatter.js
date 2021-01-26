var dateFormatter = null;

/**
 * Date time formatter utility
 */
class DateFormatter {
    /**
     * Create a new instance of this class
     */
    constructor() {
        this.format = null
        this.defaultFormat = "mm/dd/yyyy"
        this.setFormat(this.defaultFormat);

        this.dayLookup = [];
        this.dayLookup.push("Monday");
        this.dayLookup.push("Tuesday");
        this.dayLookup.push("Wednesday");
        this.dayLookup.push("Thursday");
        this.dayLookup.push("Friday");
        this.dayLookup.push("Saturday");
        this.dayLookup.push("Sunday");
    }

    /**
     * Set a new format
     * @param {String} newFormat 
     */
    setFormat(newFormat) {
        if (newFormat === null || newFormat === undefined || newFormat === "") {
            return;
        }
        this.format = newFormat.toLowerCase();
    }

    /**
     * Get the default format
     */
    getDefaultFormat() {
        return this.defaultFormat;
    }

    /**
     * Get a human readable date
     * @param {Date} date 
     */
    getHumanReadable(date) {
        let year = date.getFullYear();
        let month = String(date.getMonth() + 1).padStart(2, '0');
        let day = String(date.getDate()).padStart(2, '0')
        let readableString = this.replaceEntryWithNumber(this.format, 'd', day)
        readableString = this.replaceEntryWithNumber(readableString, 'm', month)
        readableString = this.replaceEntryWithNumber(readableString, 'y', year)
        return readableString
    }

    /**
     * Replace the entry with numbers
     * @param {String} baseString
     * @param {String} stringToReplace 
     * @param {Int32Array} number 
     */
    replaceEntryWithNumber(baseString, stringToReplace, number) {
        let stringNumber = number.toString();
        for(let i = 0; i < this.getOccurences(stringToReplace); i++) {
            let replacement = stringNumber.charAt(i);
            baseString = baseString.replace(stringToReplace, replacement);
        }

        return baseString;
    }

    /**
     * Get all the occurentsin the string
     * @param {String} stringToSearch 
     */
    getOccurences(stringToSearch) {
        let returnValue = 0;
        for(let i = 0; i < this.format.length; i++) {
            returnValue += this.format.charAt(i) === stringToSearch ? 1 : 0;
        }

        return returnValue;
    }

    /**
     * Build the day table
     * @param {LanguageManager} languageManager 
     */
    buildDayTable(languageManager) {
        this.dayLookup = [];
        this.dayLookup.push(languageManager.getTranslation("sunday"));
        this.dayLookup.push(languageManager.getTranslation("monday"));
        this.dayLookup.push(languageManager.getTranslation("tuesday"));
        this.dayLookup.push(languageManager.getTranslation("wednesday"));
        this.dayLookup.push(languageManager.getTranslation("thursday"));
        this.dayLookup.push(languageManager.getTranslation("friday"));
        this.dayLookup.push(languageManager.getTranslation("saturday"));
    }

    /**
     * Get the translated date
     * @param {Date} date 
     */
    getTranslatedDate(date) {
        if (date === null || date === undefined) {
            return "Missing date";
        }
        return this.dayLookup[date.getDay()];
    }
}

dateFormatter = dateFormatter === null ? new DateFormatter() : dateFormatter;
module.exports = dateFormatter;