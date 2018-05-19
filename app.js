
const request = require('request')
const qs = require('querystring')
const crypto = require('crypto')
const keys = require('./secretStuff')

const BinanceSync = require('./src/integrations/Binance/Sync')
const CoinApiSync = require('./src/integrations/CoinApi/Sync')
const CryptoCompareSync = require('./src/integrations/CryptoCompare/Sync')

const mongoUtil = require('./src/utils/db')

// const sync = new BinanceSync({
//   userId: 1,
//   secretKey: keys.binance.secretKey,
//   apiKey: keys.binance.apiKey,
//   pairings: ['NEOETH', 'AMBETH']
// })

// sync.init()

// const coins = new CoinApiSync({
//   apiKey: keys.CoinAPI.apiKey,
//   assets: ['NEO', 'DRGN']
// })

mongoUtil.connect().then(() => {
  const coinList = new CryptoCompareSync({ currencies: ['USD', 'GBP', 'EUR'] })
  coinList.saveCoinPrices()
})
