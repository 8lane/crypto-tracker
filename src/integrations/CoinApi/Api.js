const qs = require('querystring')
const request = require('../../utils/request')

/**
 * CoinAPI - https://docs.coinapi.io/#get-all-current-rates
 */

class Api {
  constructor({
    apiKey
  }) {
    this.apiKey = apiKey
    this.request = request
  }

  getExchangeRates(asset) {
    return this.fetch(asset, 'v1/exchangerate')
  }

  fetch(asset, endpoint) {
    let queryString

    const options = {
      url: `https://rest.coinapi.io/${endpoint}/${asset}`,
      method: 'GET',
      timeout: 3000,
      headers: {
        'X-CoinAPI-Key': this.apiKey
      }
    }

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

module.exports = Api
