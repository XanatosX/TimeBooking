const url = require('url')
const path = require('path');
const { BrowserWindow } = require('electron');

/**
 * Helper to switch the window
 */
class ContentSwitcher {
    /**
     * Switch the current window to a new one
     * @param {string} newWindowName 
     * @param {BrowserWindow} currentWindow 
     */
    switchToWindow(newWindowName, currentWindow) {
        if (currentWindow === null || currentWindow === undefined) {
            return false;
        }
        let targetUrl = path.join(__dirname, '../../../windows/' + newWindowName + '.html');
        console.log("Switch to: " + newWindowName + " page!");
        console.log("url: " + targetUrl);
        currentWindow.loadURL(url.format({
            pathname: targetUrl,
            protocol: 'file:',
            slashes: true
          }));
        
    }
}

module.exports = ContentSwitcher;