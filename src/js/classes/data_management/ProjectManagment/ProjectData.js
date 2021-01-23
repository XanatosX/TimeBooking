class ProjectData {
    /**
     * 
     * @param {string} name 
     * @param {string} folder 
     */
    constructor (name, folder) {
        this.name = name;
        this.folder = folder;
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