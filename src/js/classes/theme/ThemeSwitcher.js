var themeSwitcher = null;
/**
 * This class will allow you to switch the theme
 */
class ThemeSwitcher {
    constructor() {
        this.currentMode = "light"
        this.cssPath = "../../node_modules/bootstrap-dark-5/dist/bootstrap-dark.min.css";
    }

    /**
     * Set the mode of the theme
     * @param {string} mode 
     */
    setMode(mode) {
        this.currentMode = mode;
    }

    /**
     * Use the dark mode
     * @param {bool} isDark 
     */
    useDarkMode(isDark) {
        if (isDark) {
            this.setMode("dark");
            return;
        }
        this.setMode("light");
    }

    /**
     * Apply the current mode
     * @param {*} document 
     */
    applyMode(document) {
        if (document === null || document === undefined) {
            return;
        }
        if (this.currentMode === "dark") {
            this.applyDarkMode(document);
            return;
        }
    }

    /**
     * Apply the dark mode
     * @param {*} document 
     */
    applyDarkMode(document) {
        let linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'stylesheet');
        linkElement.setAttribute('id', 'dark-style');
        linkElement.setAttribute('type', 'text/css');
        linkElement.setAttribute('href', this.cssPath);
        
        document.getElementsByTagName('head')[0].appendChild(linkElement);
    }
}

themeSwitcher = themeSwitcher === null ? new ThemeSwitcher() : themeSwitcher;
module.exports = themeSwitcher;
