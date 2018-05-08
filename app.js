
const request = require('request')
const qs = require('querystring')
const crypto = require('crypto')
const nano = require('nano')('http://localhost:5984')
const keys = require('./secretStuff')

const BinanceSync = require('./src/integrations/Binance/Sync')

const sync = new BinanceSync({
  userId: 1,
  secretKey: keys.binance.secretKey,
  apiKey: keys.binance.apiKey,
  pairings: ['NEOETH', 'AMBETH']
})

sync.init()

// binanceApi.allOrders('NEOETH', (response, error) => {
//   console.log('res: ', response);
// })

// nano.db.create('crypto-tracker')
// const db = nano.db.use('crypto-tracker')

// db.insert({ name: 'The Art of war' }, null, function (err, body) {
//   if (err) {
//     console.log(err)
//   } else {
//     console.log(body)
//   }
// })