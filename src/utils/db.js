const nano = require('nano')('http://localhost:5984')

class Database {
  constructor() {
    this.db = nano.db.use('crypto-tracker')
  }

  add(data = {}) {
    return new Promise((resolve, reject) => {
      this.db.insert(data, null, (err, body) => {
        if (err) {
          reject(err)
        } else {
          resolve(body)
        }
      })
    })
  }
}

module.exports = new Database()
