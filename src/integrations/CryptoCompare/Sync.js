const CryptoCompareApi = require('./Api')
const db = require('../../utils/db')

class CryptoCompareSync {
  constructor({
    assets,
    currencies
  }) {
    this.assets = assets
    this.currencies = currencies
    this.api = new CryptoCompareApi()
  }

  saveAllCoins() {
    this.api.getCoinList().then((result) =>
      db.add({
        type: 'coin-list',
        assets: result
      })
    )
  }

  saveAssets() {
    const assetsToFetch = Array.from(this.assets, (asset) => this.api.getExchangeRates(asset, this.currencies))

    Promise.all(assetsToFetch).then((result) =>
      db.add({
        type: 'assets',
        assets: result
      })
    )
  }
}

module.exports = CryptoCompareSync