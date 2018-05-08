const Binance = require('./Api')
const request = require('../../utils/request')
const crypto = require('crypto')

describe('When setting up Binance integration', () => {
  let sut

  beforeEach(() => {
    sut = new Binance({ apiKey: 123, secretKey: 456 })
  })

  it('should store required api information', () => {
    expect(sut.apiKey).toEqual(123)
    expect(sut.secretKey).toEqual(456)
  })
})

describe('When making a request to the API', () => {
  let sut

  beforeEach(() => {
    sut = new Binance({ apiKey: 123, secretKey: 456 })
    spyOn(sut, 'request')
    sut.fetch({}, 'binanceendpoint')
  })

  it('should make a request', () => {
    expect(sut.request).toHaveBeenCalledWith({
      url: 'https://api.binance.com/binanceendpoint?',
      method: 'GET',
      timeout: 3000,
      headers: { 'X-MBX-APIKEY': 123 }
    }, jasmine.any(Function))
  })

  describe('and passing in a custom callback', () => {
    beforeEach(() => {
      sut = new Binance({ apiKey: 123, secretKey: 456 })
      spyOn(sut, 'request')
      sut.fetch({}, 'binanceendpoint', 'this would actually be a callback function')
    })

    it('should make a request with the provided callback', () => {
      expect(sut.request).toHaveBeenCalledWith({
        url: 'https://api.binance.com/binanceendpoint?',
        method: 'GET',
        timeout: 3000,
        headers: { 'X-MBX-APIKEY': 123 }
      }, 'this would actually be a callback function')
    })
  })

  describe('with SIGNED security set', () => {
    let sut
    let timestamp

    beforeEach(() => {
      sut = new Binance({ apiKey: 123, secretKey: 456 })
      timestamp = sut.timestamp()
      spyOn(sut, 'request')
      spyOn(crypto, 'createHmac').andReturn({ update: (qs) => ({ digest: () => 999 })})
      sut.fetch({ timestamp }, 'signedendpoint', undefined, true)
    })
  
    it('should make a request with a sha256 signature', () => {
      expect(sut.request).toHaveBeenCalledWith({
        url: `https://api.binance.com/signedendpoint?timestamp=${timestamp}&signature=999`,
        method: 'GET',
        timeout: 3000,
        headers: { 'X-MBX-APIKEY': 123 }
      }, jasmine.any(Function))
    })
  })
})

describe('When pinging Binance', () => {
  let sut

  beforeEach(() => {
    sut = new Binance({ apiKey: 123, secretKey: 456 })
    spyOn(sut, 'fetch');
    sut.ping()
  })

  it('should make a request to the ping endpoint', () => {
    expect(sut.fetch).toHaveBeenCalledWith({}, 'api/v1/ping', undefined)
  })
})

describe('When getting the server time from the Binance', () => {
  let sut

  beforeEach(() => {
    sut = new Binance({ apiKey: 123, secretKey: 456 })
    spyOn(sut, 'fetch');
    sut.time()
  })

  it('should make a request to the time endpoint', () => {
    expect(sut.fetch).toHaveBeenCalledWith({}, 'api/v1/time', undefined)
  })
})

describe('When getting the account from the Binance', () => {
  let sut

  beforeEach(() => {
    sut = new Binance({ apiKey: 123, secretKey: 456 })
    spyOn(sut, 'timestamp').andReturn(27)
    spyOn(sut, 'fetch');
    sut.account()
  })

  it('should make a request to the account endpoint', () => {
    expect(sut.fetch).toHaveBeenCalledWith({ timestamp: 27 }, 'api/v3/account', undefined, true)
  })
})

describe('When getting all orders for a particular crypto pairing', () => {
  let sut

  beforeEach(() => {
    sut = new Binance({ apiKey: 123, secretKey: 456 })
    spyOn(sut, 'timestamp').andReturn(27)
    spyOn(sut, 'fetch');
    sut.allOrders('ETHBTC')
  })

  it('should make a request to the allOrders endpoint', () => {
    expect(sut.fetch).toHaveBeenCalledWith({ symbol: 'ETHBTC', timestamp: 27 }, 'api/v3/allOrders', undefined, true)
  })
})
