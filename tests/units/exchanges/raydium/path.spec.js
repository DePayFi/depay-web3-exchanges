import { CONSTANTS } from '@depay/web3-constants'
import { find } from 'src'
import { mock, resetMocks } from '@depay/web3-mock'
import { mockPair } from 'tests/mocks/raydium'
import { getProvider, resetCache } from '@depay/web3-client'

describe('raydium', () => {
  
  const blockchain = 'solana'
  const exchange = find(blockchain, 'raydium')
  const accounts = ['2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1']
  
  let provider
  beforeEach(async ()=>{
    resetMocks()
    resetCache()
    provider = await getProvider(blockchain)
    mock({ provider, blockchain, accounts: { return: accounts } })
  })

  describe('find path', ()=>{

    it('does route direct pairs', async()=>{
      let tokenIn = CONSTANTS[blockchain].WRAPPED
      let tokenOut = CONSTANTS[blockchain].USD

      mockPair({ tokenIn, tokenOut, pair: 'BcjFnHHzJ6Y1XzLcm3nfr6tP7TGHGh15bLZazP5dAy9p' })

      let { path } = await exchange.findPath({ tokenIn, tokenOut })
      expect(path).toEqual[tokenIn, tokenOut]
    })

    it('does route SOL via WSOL', async()=>{
      let tokenIn = CONSTANTS[blockchain].NATIVE
      let tokenOut = CONSTANTS[blockchain].USD

      mockPair({ tokenIn: CONSTANTS[blockchain].WRAPPED, tokenOut, pair: 'BcjFnHHzJ6Y1XzLcm3nfr6tP7TGHGh15bLZazP5dAy9p' })

      let { path } = await exchange.findPath({ tokenIn, tokenOut })
      expect(path).toEqual[tokenIn, CONSTANTS[blockchain].WRAPPED, tokenOut]
    })

    it('does route 2 tokens via WSOL', async()=>{
      let RAY = "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R"
      let tokenIn = RAY
      let tokenOut = CONSTANTS[blockchain].USD

      mockPair({ tokenIn: CONSTANTS[blockchain].USD, tokenOut: RAY })
      mockPair({ tokenIn: CONSTANTS[blockchain].WRAPPED, tokenOut: RAY, pair: 'AVs9TA4nWDzfPJE9gGVNJMVhcQy3V9PGazuz33BfG2RA' })
      mockPair({ tokenIn: CONSTANTS[blockchain].WRAPPED, tokenOut: CONSTANTS[blockchain].USD, pair: '58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2' })

      let { path } = await exchange.findPath({ tokenIn, tokenOut })
      expect(path).toEqual[tokenIn, CONSTANTS[blockchain].WRAPPED, tokenOut]
    })

    it('does route 2 tokens via USD', async()=>{
      let RAY = "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R"
      let USDT = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"
      let tokenIn = RAY
      let tokenOut = USDT

      mockPair({ tokenIn: USDT, tokenOut: RAY })
      mockPair({ tokenIn: CONSTANTS[blockchain].WRAPPED, tokenOut: RAY })
      mockPair({ tokenIn: CONSTANTS[blockchain].WRAPPED, tokenOut: USDT })
      mockPair({ tokenIn: CONSTANTS[blockchain].USD, tokenOut: RAY, pair: 'AVs9TA4nWDzfPJE9gGVNJMVhcQy3V9PGazuz33BfG2RA' })
      mockPair({ tokenIn: CONSTANTS[blockchain].USD, tokenOut: USDT, pair: '58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2' })

      let { path } = await exchange.findPath({ tokenIn, tokenOut })
      expect(path).toEqual[tokenIn, CONSTANTS[blockchain].USD, tokenOut]
    })
  })
})
