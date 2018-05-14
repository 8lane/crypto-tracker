const db = require('../../utils/db')
const CryptoCompareSync = require('./Sync')

const mockAssets = [
  {
    "BTC": {
      "USD": 67.85,
      "GBP": 50.23
    },
    "NEO": {
      "USD": 12.85,
      "GBP": 15.23
    },
  },
]

describe('When fetching the entire coin list the CryptoCompare API', () => {
  let sut
  let api

  beforeEach(() => {
    sut = new CryptoCompareSync({ assets: ['BTC', 'ETH', 'BQX', 'NEO'], currencies: ['GBP', 'EUR'] })

    spyOn(sut.api, 'getCoinList').andReturn({ then: (cb) => cb(mockAssets) })
    spyOn(db, 'add').andReturn({ then: (cb) => cb() })

    sut.saveAllCoins()
  })

  it('should prepare a request with each asset', () => {
    expect(sut.api.getCoinList).toHaveBeenCalled()
  })

  it('should add to the database with the formatted orders', () => {
    expect(db.add).toHaveBeenCalledWith({
      type: 'coin-list',
      assets: mockAssets
    })
  })
})

describe('When syncing select assets to the database', () => {
  let sut
  let api

  beforeEach(() => {
    sut = new CryptoCompareSync({ assets: ['BTC', 'ETH', 'BQX', 'NEO'], currencies: ['GBP', 'EUR'] })

    spyOn(sut.api, 'getExchangeRates')
    spyOn(Promise, 'all').andReturn({ then: (cb) => cb(mockAssets) })
    spyOn(db, 'add').andReturn({ then: (cb) => cb() })

    sut.saveAssets()
  })

  it('should prepare a request with each asset', () => {
    expect(sut.api.getExchangeRates).toHaveBeenCalledWith('BTC', ['GBP', 'EUR'])
    expect(sut.api.getExchangeRates).toHaveBeenCalledWith('ETH', ['GBP', 'EUR'])
    expect(sut.api.getExchangeRates).toHaveBeenCalledWith('BQX', ['GBP', 'EUR'])
    expect(sut.api.getExchangeRates).toHaveBeenCalledWith('NEO', ['GBP', 'EUR'])
  })

  it('should add to the database with the formatted orders', () => {
    expect(db.add).toHaveBeenCalledWith({
      type: 'assets',
      assets: mockAssets
    })
  })
})
