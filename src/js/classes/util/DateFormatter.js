class DateFormatter {
    constructor() {
        this.format = null
        this.defaultFormat = "mm/dd/yyyy"
        this.setFormat(this.defaultFormat);
    }

    setFormat(newFormat) {
        if (newFormat === null || newFormat === undefined || newFormat === "") {
            return;
        }
        this.format = newFormat.toLowerCase();
    }

    getDefaultFormat() {
        return this.defaultFormat;
    }

    getHumanReadable(date) {
        let year = date.getFullYear();
        let month = String(date.getMonth() + 1).padStart(2, '0');
        let day = String(date.getDate()).padStart(2, '0')
        let readableString = this.replaceEntryWithNumber(this.format, 'd', day)
        readableString = this.replaceEntryWithNumber(readableString, 'm', month)
        readableString = this.replaceEntryWithNumber(readableString, 'y', year)
        return readableString
    }

    replaceEntryWithNumber(baseString, stringToReplace, number) {
        let stringNumber = number.toString();
        for(let i = 0; i < this.getOccurences(stringToReplace); i++) {
            let replacement = stringNumber.charAt(i);
            baseString = baseString.replace(stringToReplace, replacement);
        }

        return baseString;
    }

    getOccurences(stringToSearch) {
        let returnValue = 0;
        for(let i = 0; i < this.format.length; i++) {
            returnValue += this.format.charAt(i) === stringToSearch ? 1 : 0;
        }

        return returnValue;
    }
}

module.exports = DateFormatter;