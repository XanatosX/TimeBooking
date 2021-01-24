class ProjectData {
    /**
     * @param {string} name 
     * @param {string} folder 
     */
    constructor (name, folder) {
        this.locked = false;
        this.id = -1;
        this.name = name;
        this.folder = folder;
    }

    setId(newId) {
        if (this.locked) {
            return;
        }

        this.id = newId;
        this.locked = true;
    }

    getId() {
        return this.id;
    }

    /**
     * @returns string
     */
    getName() {
        return this.name;
    }

    /**
     * @returns string
     */
    getFolder() {
        return this.folder;
    }
}

module.exports = ProjectData;