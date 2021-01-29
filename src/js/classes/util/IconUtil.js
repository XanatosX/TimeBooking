let iconUtil = null;
class IconUtil {

    constructor() {
        this.basePath = null;
        this.mode = null;
        this.reset();
    }

    reset() {
        this.basePath = this.getDefaultPath();
        this.setMode("light");
    }

    setBasePath(newBasePath) {
        this.basePath = newBasePath;
    }

    getDefaultPath() {
        return "../../assets/"
    }

    setMode(mode) {
        this.mode = mode;
    }

    isDark(isDark) {
        if (isDark) {
            this.setMode("dark");
        }
        this.setMode("light");
    }

    getIcon(name) {
        console.log(this.basePath + this.mode + "/" + name);
        return this.basePath + this.mode + "/" + name;
    }
}
iconUtil = iconUtil === null ? new IconUtil() : iconUtil;
module.exports = iconUtil;