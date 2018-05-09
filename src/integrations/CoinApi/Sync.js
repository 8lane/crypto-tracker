const CoinApi = require('./Api')
const db = require('../../utils/db')

class CoinApiSync {
  constructor({
    assets,
    apiKey
  }) {
    this.assets = assets
    this.api = new CoinApi({ apiKey })
  }

  init() {
    const assetsToFetch = Array.from(this.assets, (asset) => this.api.getExchangeRates(asset))

    Promise.all(assetsToFetch).then((result) =>
      db.add({
        type: 'assets',
        assets: result
      })
    )
  }
}

module.exports = CoinApiSync