const CryptoCompareApi = require('./Api')
const mongoUtil = require('../../utils/db')
const Config = require('./config')

class CryptoCompareSync {
  constructor({ currencies }) {
    this.currencies = currencies
    this.api = new CryptoCompareApi()
    this.db = mongoUtil.getDb()
  }

  /* Job to fetch coin list once per X days */
  saveCoinList() {
    this.api.getCoinList().then((result) => {
      mongoUtil.remove('CoinList').then(() => mongoUtil.add('CoinList', Object.values(result)))
    })
  }

  /* Get fiat rates for items in coin list, once per X minutes */
  saveCoinPrices() {
    let coinSymbols

    mongoUtil.getCollection('CoinList').then((coins) => {

      coinSymbols = Array.from(coins, (coin) => coin.Symbol)

      /* Max 300 characters per request - split into seperate requests */
      let splitTokens = []
      let iteration = -1

      for (let i = 0; i < coinSymbols.length; i++) {
        if (i % Config.MAX_REQUEST_TOKENS === 0) {
          iteration++
          splitTokens.push([])
        }

        splitTokens[iteration].push(coinSymbols[i])
      }

      const requests = Array.from(splitTokens, (tokens) => this.api.getExchangeRates(tokens, this.currencies))

      Promise.all(requests).then((result) => {
        const prices = result.map((coins) =>
          Object.keys(coins).map((key) => ({
            Symbol: key,
            Balances: coins[key]
          })
        ))

        mongoUtil.remove('CoinPrices').then(() =>
          mongoUtil.add('CoinPrices', [].concat.apply([], prices)
        ))
      })
    })

  }
}

module.exports = CryptoCompareSync