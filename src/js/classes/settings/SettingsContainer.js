/**
 * This class represents a setting container
 */
class SettingsContainer {

  /**
   * Construct an empty instance of this class
   */
  constructor () {
    this.settings = {};
  }

  /**
   * This method will add a new setting to the container
   * 
   * @param  {String} name
   * @param  {String} data
   */
  addSetting (name, data) {
    this.settings[name] = data;
  }

  
  /**
   * The method will return you the value of a setting with name
   * @param  {String} name
   */
  getSetting (name) {
    if (this.settings[name] === undefined) {
      return null;
    }
    return this.settings[name];
  }

  /**
   * This method will return you the object containing the settings
   */
  getObject () {
    return this.settings;
  }

  /**
   * This function will get you a saveable string
   */
  getWritable () {
    return JSON.stringify(this.settings);
  }
}

module.exports = SettingsContainer;