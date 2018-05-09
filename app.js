
const request = require('request')
const qs = require('querystring')
const crypto = require('crypto')
const nano = require('nano')('http://localhost:5984')
const keys = require('./secretStuff')

const BinanceSync = require('./src/integrations/Binance/Sync')
const CoinApiSync = require('./src/integrations/CoinApi/Sync')

// const sync = new BinanceSync({
//   userId: 1,
//   secretKey: keys.binance.secretKey,
//   apiKey: keys.binance.apiKey,
//   pairings: ['NEOETH', 'AMBETH']
// })

// sync.init()


const coins = new CoinApiSync({
  apiKey: keys.CoinAPI.apiKey,
  assets: ['NEO', 'DRGN']
})

coins.init()


