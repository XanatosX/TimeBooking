const { fstat } = require('fs');
const Language = require('./Language.js');
var fs = require('fs');

class LanguageFileReader {
    getFileEnding() {
        return ".json";
    }

    /**
     * This method will read the file and return the class instance
     * @param {string} path 
     * @returns {Language}
     */
    readFile(path) {
        let languageContainer = new Language();
        if (!fs.existsSync(path)) {
            return languageContainer;
        }

        let content = fs.readFileSync(path, 'utf8');
        if (content == '') {
            return languageContainer;
        }
        let json = JSON.parse(content);
        languageContainer.setName(json.name);
        
        for(let key in json.data) {
            languageContainer.addTranslation(key, json.data[key]);
        }
        return languageContainer;
    }

    
    loadLanguageNames(name) {
        if (!fs.existsSync(name)) {
            return null;
        }

        let content = fs.readFileSync(name, 'utf8');
        if (content === '') {
            return null;
        }
        let json = JSON.parse(content);
        return json.name;

    }
}

module.exports = LanguageFileReader;