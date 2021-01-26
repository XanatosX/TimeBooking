const FileReader = require('./LanguageFileReader.js');
const LanguageName = require('./LanguageName.js');
var fs = require('fs');

/**
 * This manager will translate strings to any language
 */
class LanguageManager {

    /**
     * Create a new instance of this class
     * @param {String} path 
     */
    constructor(path) {
        this.reader = new FileReader();

        this.path = path;
        this.language = null;
        this.languageFile = null;
        this.fallbackFile = null;
        this.fallback = null;
        this.files = this.createFileList();
        this.setLanguage("en-us");
    }

    /**
     * Create a list with all the language files
     */
    createFileList() {  
        let returnData = [];
        if (!fs.existsSync(this.path)) {
            return returnData;
        }
        returnData = fs.readdirSync(this.path);
        let convertedData = [];
        returnData.forEach(item => {
            convertedData.push(item.replace(this.reader.getFileEnding(), ""));
        });
        return convertedData;
    }

    /**
     * Get the file path for the current languge
     */
    getFilePath() {
        return this.getSpecificFilePath(this.language);
    }

    /**
     * Get the file path to a specific language
     * @param {String} name 
     */
    getSpecificFilePath(name) {
        return this.path + "/" + name + this.reader.getFileEnding();
    }

    /**
     * The current language to use
     * @param {string} language
     */
    setLanguage(language) {
        if (!this.files.includes(language)) {
            return;
        }
        console.log("New language: " + language);
        this.languageFile = null;
        this.language = language;
        this.fallback = this.fallback === null ? this.language : this.fallback;
    }

    /**
     * Load all the translations
     */
    loadTranslation() {
        if (this.languageFile === null || this.fallbackFile === null) {
            this.languageFile = this.reader.readFile(this.getFilePath());
            this.fallbackFile = this.reader.readFile(this.getSpecificFilePath(this.fallback));
        }
        return this.languageFile;
    }

    /**
     * Get the translation for a given key
     * @param {String} key 
     */
    getTranslation(key) {
        let value = this.getRawTranslation(key);
        return value === null ? "No translation for '" + key + "'" : value;
    }

    /**
     * Get the raw translation for a given key
     * @param {String} key 
     */
    getRawTranslation(key) {
        this.loadTranslation();
        if (this.languageFile === null) {
            return null;
        }
        let value = this.languageFile.getTranslation(key);
        value = value === null ? this.fallbackFile.getTranslation(key) : value;
        if (value === null) {
            return value;
        }
        if (value.includes("{") && value.includes("}")) {
            console.log(value);
            let found = value.match(/\{[a-zA-Z]+\}/g);
            for (let index in found) {
                let replaceMarker = found[index];
                let searchKey = replaceMarker.replace("{", "").replace("}", "");

                let replacement = this.getRawTranslation(searchKey);
                replacement = replacement === null ? "" : replacement;
                value = value.replace(replaceMarker, replacement)
            }
        }

        return value;
    }

    /**
     * Get the whole language file
     */
    getTranslationContainer() {
        return this.languageFile;
    }

    /**
     * Translate the whole document
     * @param {Document} document 
     */
    applyTranslation(document) {
        let elements = document.getElementsByTagName("*");
        for (let element of elements) {
          if (element.dataset.langkey === null || element.dataset.langkey === undefined) {
            continue;
          }
          let languageString = this.getTranslation(element.dataset.langkey);
          element.innerHTML = languageString;
        }
    }

    /**
     * Get all the avaiable languages
     */
    getAvailableLanguages() {
        let returnData = [];
        for(let index in this.files) {
            let file = this.files[index];
            let displayName = this.reader.loadLanguageNames(this.getSpecificFilePath(file));
            let dataToAdd =  new LanguageName(file, displayName);
            returnData.push(dataToAdd);
        }
        return returnData;
    }
}

module.exports = LanguageManager;