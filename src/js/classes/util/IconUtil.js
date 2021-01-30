var path = require("path");
var iconUtil = null;
/**
 * This class will help you to get the paths to the icon
 */
class IconUtil {

    /**
     * Create a new instance of this class
     */
    constructor() {
        this.basePath = null;
        this.mode = null;
        this.reset();
    }

    /**
     * Reset the class
     */
    reset() {
        this.setMode("light");
        this.setBasePath(__dirname + "/../../../../resources/");
    }

    /**
     * Set a new base path
     * @param {string} newBasePath 
     */
    setBasePath(newBasePath) {    
        newBasePath = path.normalize(newBasePath);
        newBasePath = path.resolve(newBasePath);
        this.basePath = newBasePath;
    }

    /**
     * Set the mode to either light or dark
     * @param {string} mode 
     */
    setMode(mode) {
        this.mode = mode;
    }

    /**
     * Is the application in dark mode
     * @param {bool} isDark 
     */
    setIsDark(isDark) {
        if (isDark) {
            this.setMode("dark");
            return;
        }
        this.setMode("light");
    }

    /**
     * Get the path to the icon path
     * @param {string} name 
     */
    getIcon(name) {
        let correctPath = "../../resources/dark/application.png";
        let realPath = this.basePath + path.sep + this.mode + path.sep + name;
        console.log(correctPath);
        console.log(path.resolve(correctPath));
        console.log(realPath);
        return realPath;
    }

    getUrlIconPath(name) {
        let returnPath = this.getIcon(name);
        return returnPath.replace(/\\/g, "/");
    }

    getRelativeIcon(base, name) {
        let realPath = this.getIcon(name);
        realPath = path.relative(base, realPath);
        
        console.log(realPath);
        return realPath
    }

    getUrlRelativeIconPath(base, name) {
        let returnPath = this.getRelativeIcon(base, name);
        return returnPath.replace(/\\/g, "/");
    }
}
iconUtil = iconUtil === null ? new IconUtil() : iconUtil;
module.exports = iconUtil;
