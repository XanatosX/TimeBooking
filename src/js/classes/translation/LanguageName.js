/**
 * Container for a language name
 */
class LanguageName {
    /**
     * Create a new instance of this class
     * @param {string} key 
     * @param {string} name 
     */
    constructor(key, name) {
        this.key = key;
        this.name = name;
    }

    /**
     * Get the key for the language
     */
    getKey() {
        return this.key;
    }

    /**
     * Get the name of the language
     */
    getName() {
        return this.name;
    }
}

module.exports = LanguageName;