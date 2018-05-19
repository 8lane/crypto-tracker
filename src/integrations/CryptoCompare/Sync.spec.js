const CryptoCompareSync = require('./Sync')
const mongoUtil = require('../../utils/db')
const Config = require('./config')

const mockAssets = [
  {
    "BTC": {
      "GBP": 67.85,
      "EUR": 50.23
    },
    "NEO": {
      "GBP": 12,
      "EUR": 10
    },
    "ETH": {
      "GBP": 1000,
      "EUR": 899.12
    }
  },
]

const mockCoinlist = [{
  Id: "1",
  Symbol: "BTC",
  FullName: "Bitcoin"
}, {
  Id: "2",
  Symbol: "NEO",
  FullName: "Neo"
}, {
  Id: "3",
  Symbol: "ETH",
  FullName: "Etherium"
}]

describe('When syncing all crypto currencies to the database', () => {
  let sut
  let api

  beforeEach(() => {
    sut = new CryptoCompareSync({ currencies: ['GBP', 'EUR'] })

    spyOn(sut.api, 'getCoinList').andReturn({ then: (cb) => cb(mockAssets) })
    spyOn(mongoUtil, 'remove').andReturn({ then: (cb) => cb() })
    spyOn(mongoUtil, 'add').andReturn({ then: (cb) => cb() })

    sut.saveCoinList()
  })

  it('should prepare a request to fetch the coin list', () => {
    expect(sut.api.getCoinList).toHaveBeenCalled()
  })

  it('should remove the existing coin data from the database', () => {
    expect(mongoUtil.remove).toHaveBeenCalledWith('CoinList')
  })

  it('should add to the database with the coin data', () => {
    expect(mongoUtil.add).toHaveBeenCalledWith('CoinList', mockAssets)
  })
})

describe('When saving the current fiat conversions for all coins', () => {
  let sut

  beforeEach(() => {
    sut = new CryptoCompareSync({ currencies: ['GBP', 'EUR'] })
    
    Config.MAX_REQUEST_TOKENS = 2

    spyOn(sut.api, 'getExchangeRates').andCallFake((tokens) => tokens)
    spyOn(mongoUtil, 'getCollection').andReturn({ then: (cb) => cb(mockCoinlist) })
    spyOn(mongoUtil, 'add').andReturn({ then: (cb) => cb(mockCoinlist) })
    spyOn(mongoUtil, 'remove').andReturn({ then: (cb) => cb() })
    spyOn(Promise, 'all').andReturn({ then: (cb) => cb(mockAssets) })

    sut.saveCoinPrices()
  })

  it('should get the coin list', () => {
    expect(mongoUtil.getCollection).toHaveBeenCalledWith('CoinList')
  })

  it('should split the coin list into multiple requests', () => {
    expect(Promise.all).toHaveBeenCalledWith([['BTC', 'NEO'], ['ETH']])
  })

  it('should clear the existing prices from the collection', () => {
    expect(mongoUtil.remove).toHaveBeenCalledWith('CoinPrices')
  })

  it('should add the formatted fiat balance conversions to the database', () => {
    expect(mongoUtil.add).toHaveBeenCalledWith('CoinPrices', [
      { Symbol: 'BTC', Balances: { 'GBP': 67.85, 'EUR': 50.23 } },
      { Symbol: 'NEO', Balances: { 'GBP': 12, 'EUR': 10 } },
      { Symbol: 'ETH', Balances: { 'GBP': 1000, 'EUR': 899.12 } }
    ])
  })
})
