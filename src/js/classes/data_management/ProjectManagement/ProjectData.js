/**
 * This class repsrenst some project data
 */
class ProjectData {
    /**
     * Create a new instance of this
     * @param {string} name 
     * @param {string} folder 
     */
    constructor (name, folder) {
        this.locked = false;
        this.id = -1;
        this.name = name;
        this.folder = folder;
    }

    /**
     * Set the id for this project
     * @param {Int32Array} newId 
     */
    setId(newId) {
        if (this.locked) {
            return;
        }
        let realId = parseInt(newId);

        this.id = realId;
        this.locked = true;
    }

    /**
     * Get the project id
     * @returns Int32Array
     */
    getId() {
        return this.id;
    }

    /**
     * Get the project Name
     * @returns string
     */
    getName() {
        return this.name;
    }

    /**
     * Get the project Folder
     * @returns string
     */
    getFolder() {
        return this.folder;
    }
}

module.exports = ProjectData;