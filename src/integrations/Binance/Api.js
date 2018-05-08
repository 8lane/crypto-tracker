const qs = require('querystring')
const crypto = require('crypto')
const request = require('../../utils/request')

/* https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md */

class Api {
  constructor({
    secretKey,
    apiKey
  }) {
    this.secretKey = secretKey
    this.apiKey = apiKey
    this.request = request
  }

  timestamp() {
    return new Date().getTime()
  }

  sign(queryString) {
    return crypto.createHmac('sha256', this.secretKey)
      .update(queryString)
      .digest('hex');
  }

  fetch(query, endpoint, callback, security) {
    let queryString

    queryString = qs.stringify(query)

    const options = {
      url: `https://api.binance.com/${endpoint}?${queryString}`,
      method: 'GET',
      timeout: 3000,
      headers: {
        'X-MBX-APIKEY': this.apiKey
      }
    }

    if (security) {
      options.url += `&signature=${this.sign(queryString)}`;
    }

    if (callback) {
      this.request(options, callback)
    } else {
      return new Promise((resolve, reject) =>
        this.request(options, (result, error) => {
          if (error) {
            reject(error)
          }

          resolve(result)
        })
      )
    }
  }

  ping(cb) {
    return this.fetch({}, 'api/v1/ping', cb)
  }

  time(cb) {
    return this.fetch({}, 'api/v1/time', cb)
  }

  account(cb) {
    return this.fetch({ timestamp: this.timestamp() }, 'api/v3/account', cb, true)
  }

  allOrders(symbol, cb) {
    return this.fetch({ symbol, timestamp: this.timestamp() }, 'api/v3/allOrders', cb, true)
  }
}

module.exports = Api
