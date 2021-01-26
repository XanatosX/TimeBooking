var fs = require('fs');
var SettingsContainer = require('./SettingsContainer.js');

/**
 * This class will save and load settings container from the hdd
 */
class SettingsManager {

  /**
   * This method if the constructor of the settings manager
   * @param  {String} path
   */
  constructor (path) {
    this.path = path;
    this.path = path + '/settings/';
    if (!fs.existsSync(this.path)) {
      fs.mkdirSync(this.path, { recursive: true });
    }
  }

  /**
   * This method will save data to a file on the disk
   * @param  {String} name
   * @param  {Object} data
   */
  save (name, data) {
    fs.writeFileSync(this.path + name + '.json', data, 'utf8', (err) => {
      if (err) {
        return false;
      }
      return true;
    });
    return true;
  }
  
  /**
   * This method will load you a settings container from the disk
   * @param  {String} name
   */
  load (name) {
    let container = new SettingsContainer();
    let path = this.path + name + '.json';
    if (!fs.existsSync(path)) {
      return container;
    }
    let content = fs.readFileSync(path, 'utf8');
    if (content === '') {
      return container;
    }
    
    let json = JSON.parse(content);
    for(let key in json) {
      container.addSetting(key, json[key]);
    }
    return container;
  }
}

module.exports = SettingsManager;