/**
 * This class represents a single language
 */
class Language {

    /**
     * Create a new instance of this class
     */
    constructor() {
        this.data = [];
        this.name = "Undefined";
    }

    /**
     * Set the name of the language
     * @param {string} name 
     */
    setName(name) {
        this.name = name;
    }

    /**
     * get the name of the language
     * @returns string
     */
    getName() {
        return this.name;
    }

    /**
     * Add a translation for the language
     * @param {string} key 
     * @param {string} value 
     */
    addTranslation(key, value) {
        this.data[key] = value;
    }

    /**
     * Get the translation for a specific translation
     * @param {string} key 
     * @returns string
     */
    getTranslation(key) {
        if (this.data[key] === undefined) {
            return null;
        }
        return this.data[key];
    }
}

module.exports = Language;