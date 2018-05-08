const db = require('../../utils/db')
const BinanceSync = require('./Sync')

const mockBalances = [
  { asset: 'BTC', free: '0.5', locked: '12' },
  { asset: 'ETH', free: '15.2', locked: '0' },
  { asset: 'NEO', free: '0', locked: '1' }
]

describe('When syncing the Binance Api to a user account', () => {
  let sut
  let api

  beforeEach(() => {
    sut = new BinanceSync({ userId: 12 })

    spyOn(sut.api, 'account')

    sut.init()
  })

  it('should make a request to fetch account balances', () => {
    expect(sut.api.account).toHaveBeenCalled()
  })

  describe('And there is an error with the response', () => {
    let sut
  
    beforeEach(() => {
      sut = new BinanceSync({ userId: 12 })
    })
  
    it('should throw an error', () => {
      expect(() => sut.handleBalances(undefined, 'something broke')).toThrow('something broke');
    })
  })

  describe('And the API correctly returns a response', () => {
    let sut
  
    beforeEach(() => {
      sut = new BinanceSync({ userId: 12 })

      spyOn(sut, 'formatBalances').andCallThrough()
      spyOn(sut, 'getOrders')
      spyOn(db, 'add').andReturn({ then: (cb) => cb() })

      sut.handleBalances({ balances: mockBalances }, undefined)
    })
  
    it('should format the balances', () => {
      expect(sut.formatBalances).toHaveBeenCalledWith(mockBalances)
    })

    it('should add to the database with the formatted balances', () => {
      expect(db.add).toHaveBeenCalledWith({
        type: 'balance',
        userId: 12,
        balances: [
          { asset: 'BTC', amount: '0.5' },
          { asset: 'ETH', amount: '15.2' }
        ]
      })
    })

    it('should then begin to get individual orders', () => {
      expect(sut.getOrders).toHaveBeenCalled()
    })
  })

  describe('When there is an error adding balances to the database',() => {
    beforeEach(() => {
      sut = new BinanceSync({ userId: 12 })

      spyOn(sut, 'formatBalances').andCallThrough()
      spyOn(sut, 'handleError').andCallThrough()
      spyOn(db, 'add').andReturn({ then: (undefined, cb) => cb() })        
    })

    it('should throw an error', () => {
      expect(() => sut.handleBalances({ balances: mockBalances }, undefined)).toThrow();
    })
  })
})
