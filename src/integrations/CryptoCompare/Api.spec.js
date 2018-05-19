const CryptoCompareApi = require('./Api')
const request = require('../../utils/request')

describe('When making a request to the CryptoCompare Api', () => {
  let sut

  beforeEach(() => {
    sut = new CryptoCompareApi()
    spyOn(sut, 'request')
    sut.fetch({ fsym: 'BTC', tsyms: 'USD,EUR,GBP'}, 'data/price')
  })

  it('should make a request', () => {
    expect(sut.request).toHaveBeenCalledWith({
      url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD%2CEUR%2CGBP&extraParams=CryptoTrackerDev',
      method: 'GET',
      timeout: 3000,
    }, jasmine.any(Function))
  })
})

describe('When getting a single exchange rate from the CryptoCompare API', () => {
  let sut

  beforeEach(() => {
    sut = new CryptoCompareApi()
    spyOn(sut, 'fetch');
    sut.getExchangeRate('DRGN', ['EUR', 'CAD'])
  })

  it('should make a request to the exchangerate endpoint', () => {
    expect(sut.fetch).toHaveBeenCalledWith({ fysym: 'DRGN', tsyms: 'EUR,CAD' }, 'data/price')
  })
})

describe('When getting multiple exchange rates from the CryptoCompare API', () => {
  let sut

  beforeEach(() => {
    sut = new CryptoCompareApi()
    spyOn(sut, 'fetch');
    sut.getExchangeRates(['DRGN', 'BTC', 'ETC', 'NEO', 'LTC'], ['EUR', 'CAD'])
  })

  it('should make a request to the exchangerate endpoint', () => {
    expect(sut.fetch).toHaveBeenCalledWith({ fsyms: 'DRGN,BTC,ETC,NEO,LTC', tsyms: 'EUR,CAD' }, 'data/pricemulti')
  })
})

describe('When getting the entire coin list from the CryptoCompare API', () => {
  let sut

  beforeEach(() => {
    sut = new CryptoCompareApi()
    spyOn(sut, 'fetch');
    sut.getCoinList()
  })

  it('should make a request to the exchangerate endpoint', () => {
    expect(sut.fetch).toHaveBeenCalledWith({}, 'data/all/coinlist')
  })
})
