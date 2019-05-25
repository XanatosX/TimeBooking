  
  /**
   * This class will allow you to save and load cookies 
   */
  class Cookies {
  /**
   * The constructor of the cookies class
   * @param  {electron} electron
   */
  constructor (electron) {
    this.session = electron.remote.session.fromPartition('persist:name')
  }
  /**
   * This mehtod will create a new cookie
   * @param  {String} name
   * @param  {String} data
   */
  setCookie (name, data) {
    let expiration = new Date()
    let hour = expiration.getHours()
    hour += 1
    expiration.setHours(hour)
    let cookieData = {
      url: '/',
      name: name,
      value: data,
      expirationDate: expiration.getTime()
    }
    this.session.cookies.set(cookieData, function (error) {
      if (error) {
        console.log(error)
      }
    })
  }

  /**
   * This method will get you a cookie.
   * @param  {String} name
   * @param  {Function} callback
   */
  getCookie (name, callback) {
    let value = {
      name: name
    }
    this.session.cookies.get(value, function (error, cookies) {
      if (error || cookies[0] === undefined || cookies[0].value === undefined) {
        if (error) {
          console.log(error)
        }
        return
      }
      callback(null, cookies[0].value)
    })
  }

  /**
   * This method will delete all the already saved cookies
   */
  clearCookies () {
    this.session.clearStorageData({ storages: 'cookies' })
  }
}

module.exports = Cookies
