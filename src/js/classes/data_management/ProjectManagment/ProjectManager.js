const { log } = require('console');
var fs = require('fs');
const { type } = require('os');
const { join } = require('path')
const ProjectData = require('./ProjectData');

class ProjectManager {
    constructor(rootFolder) {
        this.rootFolder = rootFolder;
        this.projectFolder = rootFolder + "/bookings/";
        this.projectFileFolder = rootFolder + "/projects/";
        this.projects = this.loadProjectFiles();
    }

    reloadProjects() {
        this.projects = this.loadProjectFiles();
    }

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

    loadProjectFiles() {
        let returnProjects = [];
        let scannedProjects = this.scanForProjects();
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
        if (!fs.existsSync(this.getTempProjectFile())) {

        }
        console.log(returnProjects);

        return returnProjects;
    }

    getTempProjectFile() {
        return this.projectFileFolder + 'newProjects.json';
    }

    getProjectFile() {
        return this.projectFileFolder + 'projects.json';
    }

    getProjectFolder(projectName) {
        return this.projectFolder + projectName;
    }

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
                let folder = this.getProjectFolder(folderName);
                let files = fs.readdirSync(folder);
                files.forEach(file => {
                    let fullPath = folder + '/' + file;
                    fs.unlinkSync(fullPath);
                });
                fs.rmdirSync(this.getProjectFolder(folderName));
            }

        })

        return writeComplete;
    }

    writeTempProjectFile() {
        return this.writeData(this.projects, this.getTempProjectFile());
    }

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

    getHighestId() {
        let returnId = 0;
        this.projects.forEach(project => {
            returnId = returnId < project.getId() ? project.getId() : returnId;
        })

        return returnId;
    }

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

    replaceProject(oldProject, newProject) {
        let id = oldProject.getId();
        let deleteComplete = this.deleteProjectById(id);
        if (!deleteComplete) {
            return deleteComplete;
        }
        newProject.setId(id);
        return this.addProject(newProject);
    }

    deleteProject(project) {
        return this.deleteProjectById(project.getId());
    }

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

    deleteProjectFolder(project) {
        let folderToDelete = project.getFolder();
        let fullPath = this.projectFolder + project.getFolder();
        console.log('Delete folder at ' + fullPath);
    }

    getProjectByFolder(folder) {
        return this.projects.find(project => project.getFolder() === folder);
    }

    getProjectById (id) {
        let realId = parseInt(id);
        return this.projects.find(project => project.getId() === realId);
    }

    getProjects() {
        return this.projects;
    }
}

module.exports = ProjectManager;