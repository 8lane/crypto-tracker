const MongoClient = require('mongodb').MongoClient
const mongoUrl = 'mongodb://localhost:27017'
const dbName = 'CryptoTracker'

let _db

const Database = {
  connect: () => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(mongoUrl, (err, client) => {
        if (err) {
          reject(err)
        }

        _db = client.db(dbName)
        
        console.log("Connected successfully to server")

        resolve()
      })
    })
  },

  getDb: () => {
    return _db
  },

  getCollection(collection) {
    return new Promise((resolve, reject) => {
      _db.collection(collection).find().toArray((err, result) => {
        if (err) reject(err)
        resolve(result)
      })
    })
  },

  add(collection, data) {
    return new Promise((resolve, reject) => {
      _db.collection(collection).insert(data, (err, result) => {
        if (err) reject(err)
        resolve(result)
      })
    })
  },

  remove(collection) {
    return new Promise((resolve, reject) => {
      _db.collection(collection).remove((err, result) => {
        if (err) reject(err)
        resolve(result)
      })
    })
  }
}

module.exports = Database
