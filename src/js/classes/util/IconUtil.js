let iconUtil = null;
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
        this.basePath = this.getDefaultPath();
        this.setMode("light");
    }

    /**
     * Set a new base path
     * @param {string} newBasePath 
     */
    setBasePath(newBasePath) {
        this.basePath = newBasePath;
    }

    /**
     * Get the default path
     */
    getDefaultPath() {
        return "../../assets/"
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
        }
        this.setMode("light");
    }

    /**
     * Get the path to the icon path
     * @param {string} name 
     */
    getIcon(name) {
        console.log(this.basePath + this.mode + "/" + name);
        return this.basePath + this.mode + "/" + name;
    }
}
iconUtil = iconUtil === null ? new IconUtil() : iconUtil;
module.exports = iconUtil;