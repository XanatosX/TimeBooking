var fs = require('fs');
const { join } = require('path')
const ProjectData = require('./ProjectData');

class ProjectManager {
    constructor(rootFolder) {
        this.rootFolder = rootFolder;
        this.projectFolder = rootFolder + "/bookings/";
        this.projectFileFolder = rootFolder + "/projects/";
        this.projects = this.loadProjectFiles();
        console.log(this.projects);
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

        let projects = this.readProjectFile();
        if (projects === null || projects.length === 0) {
            console.log("No project file found! Creating first one!");
            for(let index in scannedProjects) {
                let folder = scannedProjects[index];
                let projectData = new ProjectData(folder, folder);
                returnProjects.push(projectData);
            }
            this.projects = returnProjects;
            this.writeProjectFile();
            return this.loadProjectFiles();
        }
        returnProjects = projects;

        return returnProjects;
    }

    readProjectFile() {
        let path = this.projectFileFolder + 'projects.json';
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
        projectsJson.forEach(projectData => {
            let name = projectData.name;
            let folder = projectData.folder;
            if (name === null || folder === null) {
                return;
            }

            returnData.push(new ProjectData(name, folder));
        });
    
        return returnData;
    }

    writeProjectFile() {
        if (!fs.existsSync(this.projectFileFolder)) {
            console.log("Create project file folder: " + this.projectFileFolder);
            fs.mkdirSync(this.projectFileFolder);
        }
        let path = this.projectFileFolder + 'projects.json';
        let dataToWrite = {};
        dataToWrite.projects = [];
        console.log(this.projects);
        this.projects.forEach(project => {
            let projectDataSet = {
                name: project.getName(),
                folder: project.getFolder()
            }
            dataToWrite.projects.push(projectDataSet);
        });
        let writeableString = JSON.stringify(dataToWrite)
        console.log("Would write data");
        console.log(writeableString);
        fs.writeFileSync(path, writeableString, 'utf8', (err) => {
            if (err) {
              return false;
            }
            return true;
        });
    }

    getProjects() {
        return this.projects;
    }
}

module.exports = ProjectManager;