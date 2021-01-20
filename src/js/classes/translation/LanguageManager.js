const FileReader = require('./LanguageFileReader.js');
const LanguageName = require('./LanguageName.js');
var fs = require('fs');
const { Console, log } = require('console');

class LanguageManager {

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

    getFilePath() {
        return this.getSpecificFilePath(this.language);
    }

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

    loadTranslation() {
        if (this.languageFile === null || this.fallbackFile === null) {
            this.languageFile = this.reader.readFile(this.getFilePath());
            this.fallbackFile = this.reader.readFile(this.getSpecificFilePath(this.fallback));
        }
        return this.languageFile;
    }

    getTranslation(key) {
        let value = this.getRawTranslation(key);
        return value === null ? "No translation for '" + key + "'" : value;
    }

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

    getTranslationContainer() {
        return this.languageFile;
    }

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