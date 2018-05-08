const request = require('request')

module.exports = (options, callback) => {
  return request(options, (err, response, body) => {
    try {
      payload = JSON.parse(body)
      callback(payload)
    } catch (e) {
      payload = body;
      callback(null, payload)
    }
  })
}
