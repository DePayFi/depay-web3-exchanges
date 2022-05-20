import { findByName } from 'src'
import { UniswapV2Router02, UniswapV2Factory, UniswapV2Pair } from 'src/exchanges/quickswap/apis'

describe('quickswap', () => {

  describe('basics', ()=> {
    
    it('provides basic structured data for quickswap', ()=> {
      let exchange = findByName('quickswap')
      expect(exchange.name).toEqual('quickswap')
      expect(exchange.blockchain).toEqual('polygon')
      expect(exchange.alternativeNames).toEqual([])
      expect(exchange.label).toEqual('QuickSwap')
      expect(exchange.logo).toEqual('data:image/png;base64,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')
      expect(exchange.contracts.router.address).toEqual('0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff')
      expect(exchange.contracts.router.api).toEqual(UniswapV2Router02)
      expect(exchange.contracts.factory.address).toEqual('0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32')
      expect(exchange.contracts.factory.api).toEqual(UniswapV2Factory)
      expect(exchange.contracts.pair.api).toEqual(UniswapV2Pair)
    })
  })
})
