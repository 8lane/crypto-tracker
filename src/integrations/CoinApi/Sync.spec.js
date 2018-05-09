const db = require('../../utils/db')
const CoinApiSync = require('./Sync')

const mockAssets = [
  {
    "asset_id_base": "BTC",
    "rates" : [
      {
        "time": "2017-08-09T14:31:37.0520000Z",
        "asset_id_quote": "USD",
        "rate": 3258.8875417798037784035133948
      }
    ]
  },
  {
    "asset_id_base": "NEO",
    "rates" : [
      {
        "time": "2017-08-09T14:31:37.123",
        "asset_id_quote": "USD",
        "rate": 72
      }
    ]
  },
]

describe('When syncing the CoinAPI coins to the database', () => {
  let sut
  let api

  beforeEach(() => {
    sut = new CoinApiSync({ apiKey: 123, assets: ['BTC', 'ETH', 'BQX', 'NEO'] })

    spyOn(sut.api, 'getExchangeRates')
    spyOn(Promise, 'all').andReturn({ then: (cb) => cb(mockAssets) })
    spyOn(db, 'add').andReturn({ then: (cb) => cb() })

    sut.init()
  })

  it('should make prepare a request with each asset', () => {
    expect(sut.api.getExchangeRates).toHaveBeenCalledWith('BTC')
    expect(sut.api.getExchangeRates).toHaveBeenCalledWith('ETH')
    expect(sut.api.getExchangeRates).toHaveBeenCalledWith('BQX')
    expect(sut.api.getExchangeRates).toHaveBeenCalledWith('NEO')
  })

  it('should add to the database with the formatted orders', () => {
    expect(db.add).toHaveBeenCalledWith({
      type: 'assets',
      assets: mockAssets
    })
  })
})
