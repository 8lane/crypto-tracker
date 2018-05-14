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
      url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD%2CEUR%2CGBP',
      method: 'GET',
      timeout: 3000,
    }, jasmine.any(Function))
  })
})

describe('When getting an exchange rate from the CryptoCompare API', () => {
  let sut

  beforeEach(() => {
    sut = new CryptoCompareApi()
    spyOn(sut, 'fetch');
    sut.getExchangeRates('DRGN', ['EUR', 'CAD'])
  })

  it('should make a request to the exchangerate endpoint', () => {
    expect(sut.fetch).toHaveBeenCalledWith({ fysym: 'DRGN', tsyms: 'EUR,CAD' }, 'data/price')
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
