const BinanceApi = require('./Api')
const db = require('../../utils/db')

class BinanceSync {
  constructor({
    userId,
    pairings,
    secretKey,
    apiKey
  }) {
    this.userId = userId
    this.pairings = pairings
    this.api = new BinanceApi({ secretKey, apiKey })

    this.getOrders = this.getOrders.bind(this)
    this.handleBalances = this.handleBalances.bind(this)
  }
  
  getOrders() {
    const pairingsToFetch = this.pairings.reduce((accumulator, symbol) => {
      accumulator.push(this.api.allOrders(symbol))
      return accumulator
    }, [])

    Promise.all(pairingsToFetch).then((result) => {
      console.log('RES',  result);
    })
  }

  formatBalances(balances) {
    return balances
      .filter(item => parseFloat(item.free) > 0)
      .reduce((accumulator, item) => {
        accumulator.push({ asset: item.asset, amount: item.free })
        return accumulator
      }, [])
  }

  handleError(err) {
    throw Error(err)
  }

  handleBalances(result, error) {
    const type = 'balance'
    const userId = this.userId

    if (typeof error !== 'undefined') {
      this.handleError(error)
      return false
    }

    if (result) {
      const balances = this.formatBalances(result.balances)
      db.add({ type, userId, balances }).then(this.getOrders, this.handleError)
    }
  }

  init() {
    this.api.account(this.handleBalances)
  }
}

module.exports = BinanceSync