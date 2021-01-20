class LanguageName {
    constructor(key, name) {
        this.key = key;
        this.name = name;
    }

    getKey() {
        return this.key;
    }

    getName() {
        return this.name;
    }
}

module.exports = LanguageName;