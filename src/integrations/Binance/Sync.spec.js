const db = require('../../utils/db')
const BinanceSync = require('./Sync')

const mockBalances = [
  { asset: 'BTC', free: '0.5', locked: '12' },
  { asset: 'ETH', free: '15.2', locked: '0' },
  { asset: 'NEO', free: '0', locked: '1' }
]

const mockOrders = [
  [
    { symbol: 'NEOETH', status: 'FILLED', origQty: '3.0000000', clientOrderId: '123', price: '1', type: 'LIMIT', side: 'BUY', time: '123' },
    { symbol: 'NEOETH', status: 'FILLED', origQty: '12', clientOrderId: '456', price: '2', type: 'LIMIT', side: 'BUY', time: '123' },
    { symbol: 'NEOETH', status: 'FILLED', origQty: '0.023', clientOrderId: '789', price: '3', type: 'MARKET', side: 'BUY', time: '123' }
  ],
  [
    { symbol: 'AMBETH', status: 'FILLED', origQty: '23.6', clientOrderId: '987', price: '4', type: 'LIMIT', side: 'BUY', time: '123' },
    { symbol: 'AMBETH', status: 'CANCELLED', origQty: '0.1', clientOrderId: '654', price: '5', type: 'LIMIT', side: 'BUY', time: '123' }
  ]
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

  describe('When getting orders for each pairing/symbol', () => {
    let sut
  
    beforeEach(() => {
      sut = new BinanceSync({ userId: 12 })

      sut.pairings = ['NEOETH', 'AMBETH']
      
      spyOn(Promise, 'all').andReturn({ then: (cb) => cb(mockOrders) })
      spyOn(sut.api, 'allOrders')
      spyOn(sut, 'formatOrders').andCallThrough()
      spyOn(db, 'add').andReturn({ then: (cb) => cb() })
      
      sut.getOrders()
    })

    it('should format the orders', () => {
      expect(sut.formatOrders).toHaveBeenCalledWith(mockOrders)
    })

    it('should add to the database with the formatted orders', () => {
      expect(db.add).toHaveBeenCalledWith({
        type: 'orders',
        userId: 12,
        orders: {
          NEOETH: [
            { amount: '3.0000000', id: '123', price: '1', type: 'LIMIT', side: 'BUY', timestamp: '123' },
            { amount: '12', id: '456', price: '2', type: 'LIMIT', side: 'BUY', timestamp: '123' },
            { amount: '0.023', id: '789', price: '3', type: 'MARKET', side: 'BUY', timestamp: '123' }
          ],
          AMBETH: [
            { amount: '23.6', id: '987', price: '4', type: 'LIMIT', side: 'BUY', timestamp: '123' },
          ]
        }
      })
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
