const electron = require('electron');
const remote = electron.remote;
const { exec } = require('child_process');

var linkOpenerUtil = null;
/**
 * Link opener utility
 */
class LinkOpenerUtil {
    /**
     * Create a new instance
     */
    constructor() {
        this.platform = null;
    }

    /**
     * Set the platform
     * @param {string} platform 
     */
    setPlatform(platform) {
        this.platform = platform;
    }

    /**
     * Open the link on the syste,
     * @param {string} url 
     */
    openLink(url) {
        switch (this.platform) {
            case "linux":
                exec("xdg-open " + url);
                break;
            default:
                exec("start " + url);
                break;
        }
    }
}

linkOpenerUtil = linkOpenerUtil === null ? new LinkOpenerUtil() : linkOpenerUtil;
module.exports = linkOpenerUtil;