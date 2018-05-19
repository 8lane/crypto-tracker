const qs = require('querystring')
const request = require('../../utils/request')

/**
 * CryptoCompare - https://min-api.cryptocompare.com/
 */

class Api {
  constructor() {
    this.request = request
  }

  getCoinList() {
    return this.fetch({}, 'data/all/coinlist')
  }

  getExchangeRate(asset, currencies) {
    return this.fetch({ fysym: asset, tsyms: currencies.join(',') }, 'data/price')
  }

  getExchangeRates(assets, currencies) {
    return this.fetch({ fsyms: assets.join(','), tsyms: currencies.join(',') }, 'data/pricemulti')
  }

  fetch(query, endpoint) {
    let queryString

    queryString = qs.stringify({ ...query, extraParams: 'CryptoTrackerDev' })

    const options = {
      url: `https://min-api.cryptocompare.com/${endpoint}?${queryString}`,
      method: 'GET',
      timeout: 3000,
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
