class Language {

    constructor() {
        this.data = [];
        this.name = "Undefined";
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    addTranslation(key, value) {
        this.data[key] = value;
    }

    getTranslation(key) {
        if (this.data[key] === undefined) {
            return null;
        }
        return this.data[key];
    }
}

module.exports = Language;