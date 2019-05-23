class Cookies {
  constructor (electron) {
    this.session = electron.remote.session.fromPartition('persist:name')
  }

  setCookie (name, data) {
    var expiration = new Date()
    var hour = expiration.getHours()
    hour += 1
    expiration.setHours(hour)
    var cookieData = {
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

  getCookie (name, callback) {
    var value = {
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

  clearCookies () {
    this.session.clearStorageData({ storages: 'cookies' })
  }
}

module.exports = Cookies
