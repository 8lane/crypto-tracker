const CoinApi = require('./Api')
const request = require('../../utils/request')

describe('When setting up CoinAPI integration', () => {
  let sut

  beforeEach(() => {
    sut = new CoinApi({ apiKey: 999 })
  })

  it('should store required api information', () => {
    expect(sut.apiKey).toEqual(999)
  })
})

describe('When making a request to the CoinAPI service', () => {
  let sut

  beforeEach(() => {
    sut = new CoinApi({ apiKey: 999 })
    spyOn(sut, 'request')
    sut.fetch('BTC', 'v1/endpointnamehere')
  })

  it('should make a request', () => {
    expect(sut.request).toHaveBeenCalledWith({
      url: 'https://rest.coinapi.io/v1/endpointnamehere/BTC',
      method: 'GET',
      timeout: 3000,
      headers: { 'X-CoinAPI-Key': 999 }
    }, jasmine.any(Function))
  })
})

describe('When getting an exchange rate from the CoinAPI service', () => {
  let sut

  beforeEach(() => {
    sut = new CoinApi({ apiKey: 999 })
    spyOn(sut, 'fetch');
    sut.getExchangeRates('DRGN')
  })

  it('should make a request to the exchangerate endpoint', () => {
    expect(sut.fetch).toHaveBeenCalledWith('DRGN', 'v1/exchangerate')
  })
})
