const { log } = require('console');
var fs = require('fs');
const { type } = require('os');
const { join } = require('path')
const ProjectData = require('./ProjectData');

/**
 * Project manager class
 */
class ProjectManager {
    /**
     * Create a new instance of this class
     * @param {String} rootFolder 
     */
    constructor(rootFolder) {
        this.rootFolder = rootFolder;
        this.projectFolder = rootFolder + "/bookings/";
        this.projectFileFolder = rootFolder + "/projects/";
        this.projects = this.loadProjectFiles();
    }

    /**
     * Reload all the projects
     */
    reloadProjects() {
        this.projects = this.loadProjectFiles();
    }

    /**
     * Scan the project folder for new directories
     */
    scanForProjects() {
        let returnData = [];
        if (!fs.existsSync(this.projectFolder)) {
            return returnData;
        }
        
        returnData = fs.readdirSync(this.projectFolder).filter(f => fs.statSync(join(this.projectFolder, f)).isDirectory());
        console.log("Found following directories in " + this.projectFolder);
        console.log(returnData);
        return returnData;
    }

    /**
     * Load the project file
     */
    loadProjectFiles() {
        let returnProjects = [];
        let scannedProjects = this.scanForProjects();
        if (!scannedProjects.includes('default')) {
            scannedProjects.push('default');
        }
        if (!fs.existsSync(this.projectFileFolder)) {
            console.log("Create project file folder: " + this.projectFileFolder);
            fs.mkdirSync(this.projectFileFolder);
        }

        let projects = this.readProjectFile(scannedProjects);
        console.log(projects);
        if (projects === null || projects.length === 0) {
            console.log("No project file found! Creating first one!");
            for(let index in scannedProjects) {
                let folder = scannedProjects[index];
                let projectData = new ProjectData(folder, folder);
                returnProjects.push(projectData);
            }
            this.writeData(returnProjects, this.getProjectFile());
            return this.loadProjectFiles();
        }
        returnProjects = projects;
        let additionalFolderFound = false;
        scannedProjects.forEach(folderName => {
            let hit = returnProjects.find(project => project.getFolder() === folderName);
            if (hit === undefined) {
                console.log("Found additional project folder: " + folderName);
                returnProjects.push(new ProjectData(folderName, folderName));
                additionalFolderFound = true;
            }
        });
        if (additionalFolderFound) {
            this.writeData(returnProjects, this.getProjectFile());
        }
        for(let index in returnProjects) {
            returnProjects[index].setId(index);
        }
        console.log(returnProjects);

        return returnProjects;
    }

    /**
     * Get the path to the temp project file
     */
    getTempProjectFile() {
        return this.projectFileFolder + 'newProjects.json';
    }

    /**
     * Get the path to the project file
     */
    getProjectFile() {
        return this.projectFileFolder + 'projects.json';
    }

    /**
     * Get the path to a project folder
     * @param {String} projectName 
     */
    getProjectFolder(projectName) {
        return this.projectFolder + projectName;
    }

    /**
     * Read the project file
     * @param {Array} folderData 
     */
    readProjectFile(folderData) {
        let newPath = this.getTempProjectFile();
        let path = this.getProjectFile();
        let tempMode = fs.existsSync(newPath);
        path = tempMode ? newPath : path;

        let returnData = [];
        if (!fs.existsSync(path)) {
          return returnData;
        }
        let content = fs.readFileSync(path, 'utf8');
        if (content === '') {
          console.log('Seems like the file is empty!');
        }
        let json = JSON.parse(content);
        if (json === null) {
            return returnData;
        }
        if (json.projects === undefined) {
            return returnDatanull;
        }

        let projectsJson = json.projects;
        let updateRequired = false;
        projectsJson.forEach(projectData => {
            let foundData = folderData.find(folder => projectData.folder === folder);
            if (!tempMode && foundData === undefined) {
                console.log('Folder ' + projectData.folder + ' with name ' + projectData.name + ' seems to be deleted!');
                updateRequired = true;
                return;
            }
            let name = projectData.name;
            let folder = projectData.folder;
            if (name === null || folder === null) {
                return;
            }

            returnData.push(new ProjectData(name, folder));
        });
    
        if (updateRequired) {
            console.log('Updating project file!');
            this.writeData(returnData, this.getProjectFile());
        }
        return returnData;
    }

    /**
     * Write the project file
     */
    writeProjectFile() {
        console.log("write Project file!");
        let writeComplete = this.writeData(this.projects, this.getProjectFile());
        console.log(writeComplete);
        if (!writeComplete) {
            return writeComplete;
        }

        this.projects.forEach(project => {
            let projectFolder = this.getProjectFolder(project.getFolder());
            if (!fs.existsSync(projectFolder)) {
                console.log("Create project folder " + projectFolder);
                fs.mkdirSync(projectFolder);
                return;
            }
        });


        let foldersFound = this.scanForProjects();
        console.log(foldersFound);
        console.log(this.projects);
        foldersFound.forEach(folderName => {
            console.log("check if config exists: " + folderName);
            let project = this.getProjectByFolder(folderName);
            if (project === undefined) {
                console.log("Project is missing folder getting deleted!");
                this.deleteProjectFolder(folderName);
            }

        })

        return writeComplete;
    }

    /**
     * Write the temp project file
     */
    writeTempProjectFile() {
        return this.writeData(this.projects, this.getTempProjectFile());
    }

    /**
     * Clear the temp project file
     */
    clearTempProjectFile() {
        if (!fs.existsSync(this.getTempProjectFile())) {
            return true;
        }
        try {
            fs.unlinkSync(this.getTempProjectFile());
        } catch (err) {
            return false;
        }
        return true;
        
    }

    /**
     * Write the data to the disc
     * @param {ProjectData} projectData 
     * @param {String} path 
     */
    writeData(projectData, path) {
        console.log(path);
        if (this.projects !== undefined) {
            this.projects.sort( (projectA, projectB) => projectA.getId() - projectB.getId());
        }
        if (!fs.existsSync(this.projectFileFolder)) {
            console.log("Create project file folder: " + this.projectFileFolder);
            fs.mkdirSync(this.projectFileFolder);
        }
        if (projectData === null || projectData === undefined) {
            return false;
        }
        let dataToWrite = {};
        dataToWrite.projects = [];
        console.log(projectData);
        projectData.forEach(project => {
            let projectDataSet = {
                name: project.getName(),
                folder: project.getFolder()
            }
            dataToWrite.projects.push(projectDataSet);
        });
        console.log(dataToWrite);
        let writeableString = JSON.stringify(dataToWrite)
        console.log("Would write data");
        console.log(writeableString);
        fs.writeFileSync(path, writeableString, 'utf8', (err) => {
            if (err) {
              return false;
            }
            return true;
        });

        return true;
    }

    /**
     * Get the highest id
     */
    getHighestId() {
        let returnId = 0;
        this.projects.forEach(project => {
            returnId = returnId < project.getId() ? project.getId() : returnId;
        })

        return returnId;
    }

    /**
     * Add a new project
     * @param {ProjectData} projectData 
     */
    addProject(projectData) {
        let found = this.getProjectByFolder(projectData.getFolder());
        if (found !== undefined) {
            console.log("Already exisiting!");
            return false;
        }
        if (projectData.getId() === -1) {
            let newNumber = this.getHighestId();
            newNumber += 1;
            projectData.setId(newNumber);
        }
        console.log("add project!")
        console.log(projectData)
        this.projects.push(projectData);
        console.log(this.projects);
        return true;
    }

    /**
     * Replace a project
     * @param {ProjectData} oldProject 
     * @param {ProjectData} newProject 
     */
    replaceProject(oldProject, newProject) {
        let id = oldProject.getId();
        let deleteComplete = this.deleteProjectById(id);
        if (!deleteComplete) {
            return deleteComplete;
        }
        newProject.setId(id);
        return this.addProject(newProject);
    }

    /**
     * Delete a project
     * @param {ProjectData} project 
     */
    deleteProject(project) {
        return this.deleteProjectById(project.getId());
    }

    /**
     * Delete a project by the id
     * @param {Int31Array} id 
     */
    deleteProjectById(id) {
        let index = this.projects.findIndex(project => project.getId() == id);
        console.log(id);
        if (index === undefined) {
            return false;
        }
        console.log('remove project at index ' + index);
        console.log(this.projects[index]);
        this.projects.splice(index, 1);
        return true;
    }

    /**
     * 
     * @param {*} project 
     */
    deleteProjectFolder(folderName) {
        let folder = this.getProjectFolder(folderName);
        console.log('Delete folder at ' + folder);
        let files = fs.readdirSync(folder);
        files.forEach(file => {
            let fullPath = folder + '/' + file;
            fs.unlinkSync(fullPath);
        });
        fs.rmdirSync(this.getProjectFolder(folderName));
    }

    /**
     * Get a project by the folder
     * @param {String} folder 
     */
    getProjectByFolder(folder) {
        return this.projects.find(project => project.getFolder() === folder);
    }

    /**
     * Get a project by the id
     * @param {Int32Array} id 
     */
    getProjectById (id) {
        let realId = parseInt(id);
        return this.projects.find(project => project.getId() === realId);
    }

    /**
     * Get all project
     */
    getProjects() {
        return this.projects;
    }
}

module.exports = ProjectManager;