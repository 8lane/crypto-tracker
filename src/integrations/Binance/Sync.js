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
    const pairingsToFetch = Array.from(this.pairings, (pairing) => this.api.allOrders(pairing))

    Promise.all(pairingsToFetch).then((result) => db.add({
      type: 'orders',
      userId: this.userId,
      orders: this.formatOrders(result)
    }).then(() => console.log('saved orders'), this.handleError))
  }

  formatBalances(balances) {
    return balances
      .filter((item) => parseFloat(item.free) > 0)
      .reduce((accumulator, item) => {
        accumulator.push({ asset: item.asset, amount: item.free })
        return accumulator
      }, [])
  }

  formatOrders(pairings) {
    let formattedOrders

    pairings.forEach((orders) => {
      const symbol = orders[0].symbol

      formattedOrders = Object.assign({}, formattedOrders, {
        [symbol]: orders
          .filter((item) => item.status === 'FILLED')
          .reduce((accumulator, item) => {
            accumulator.push({
              id: item.clientOrderId,
              amount: item.origQty,
              price: item.price,
              type: item.type,
              side: item.side,
              timestamp: item.time
            })
            return accumulator
          }, [])
      })
    })

    return formattedOrders
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