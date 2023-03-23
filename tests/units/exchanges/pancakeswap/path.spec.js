import Blockchains from '@depay/web3-blockchains'
import { find } from 'src'
import { mock, resetMocks } from '@depay/web3-mock'
import { mockDecimals } from 'tests/mocks/token'
import { mockPair } from 'tests/mocks/pancakeswap'
import { getProvider, resetCache } from '@depay/web3-client'
import { Token } from '@depay/web3-tokens'

describe('pancakeswap', () => {
  
  const exchange = find('bsc', 'pancakeswap')
  const blockchain = 'bsc'
  const accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
  
  let provider
  beforeEach(async ()=>{
    resetMocks()
    resetCache()
    provider = await getProvider(blockchain)
    mock({ blockchain, accounts: { return: accounts } })
  })

  describe('find path', ()=>{

    it('does not route through USD->USD->WRAPPED->TOKENB', async()=>{
      let tokenIn = Blockchains[blockchain].stables.usd[0]
      let tokenOut = '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82' // CAKE
      mockPair({ provider, tokenIn, tokenOut, pair: Blockchains[blockchain].zero })
      mockPair({ provider, tokenIn, tokenOut: Blockchains[blockchain].wrapped.address, pair: Blockchains[blockchain].zero })
      let USDtoUSDMock = mockPair({ provider, tokenIn: Blockchains[blockchain].stables.usd[0], tokenOut: Blockchains[blockchain].stables.usd[0], pair: Blockchains[blockchain].zero })
      let { path } = await exchange.findPath({ tokenIn, tokenOut })
      expect(USDtoUSDMock.calls.count()).toEqual(0)
      expect(path).toEqual(undefined)
    })

    it('does not route through TOKENA->WRAPPED->USD->USD', async()=>{
      let tokenIn = '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82' // CAKE
      let tokenOut = Blockchains[blockchain].stables.usd[0]
      mockPair({ provider, tokenIn, tokenOut, pair: Blockchains[blockchain].zero })
      mockPair({ provider, tokenIn: Blockchains[blockchain].stables.usd[0], tokenOut: Blockchains[blockchain].wrapped.address, pair: Blockchains[blockchain].zero })
      mockPair({ provider, tokenIn, tokenOut: Blockchains[blockchain].wrapped.address, pair: '0x0ed7e52944161450477ee417de9cd3a859b14fd0' })
      let USDtoUSDMock = mockPair({ provider, tokenIn: Blockchains[blockchain].stables.usd[0], tokenOut: Blockchains[blockchain].stables.usd[0], pair: Blockchains[blockchain].zero })
      let { path } = await exchange.findPath({ tokenIn, tokenOut })
      expect(USDtoUSDMock.calls.count()).toEqual(0)
      expect(path).toEqual(undefined)
    })

    it('does not route through TOKENA->USD->WRAPPED->WRAPPED', async()=>{
      let tokenIn = '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82' // CAKE
      let tokenOut = Blockchains[blockchain].wrapped.address
      mockPair({ provider, tokenIn, tokenOut, pair: Blockchains[blockchain].zero })
      mockPair({ provider, tokenIn, tokenOut: Blockchains[blockchain].stables.usd[0], pair: '0x804678fa97d91b974ec2af3c843270886528a9e6' })
      mockDecimals({ provider, blockchain, address: Blockchains[blockchain].stables.usd[0], value: 18 })
      let WRAPPEDtoWRAPPEDMock = mockPair({ provider, tokenIn: Blockchains[blockchain].wrapped.address, tokenOut: Blockchains[blockchain].wrapped.address, pair: Blockchains[blockchain].zero })
      let { path } = await exchange.findPath({ tokenIn, tokenOut })
      expect(WRAPPEDtoWRAPPEDMock.calls.count()).toEqual(0)
      expect(path).toEqual(undefined)
    })

    it('does not route through WRAPPED->WRAPPED->USD->TOKENB', async()=>{
      let tokenIn = Blockchains[blockchain].wrapped.address
      let tokenOut = '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82' // CAKE
      mockPair({ provider, tokenIn, tokenOut, pair: Blockchains[blockchain].zero })
      mockPair({ provider, tokenIn, tokenOut: Blockchains[blockchain].stables.usd[0], pair: '0x58f876857a02d6762e0101bb5c46a8c1ed44dc16' })
      mockDecimals({ provider, blockchain, address: Blockchains[blockchain].stables.usd[0], value: 18 })
      let WRAPPEDtoWRAPPEDMock = mockPair({ provider, tokenIn: Blockchains[blockchain].wrapped.address, tokenOut: Blockchains[blockchain].wrapped.address, pair: Blockchains[blockchain].zero })
      let { path } = await exchange.findPath({ tokenIn, tokenOut })
      expect(WRAPPEDtoWRAPPEDMock.calls.count()).toEqual(0)
      expect(path).toEqual(undefined)
    })

    it('does not consider path existing if pair does not have enough reserves for an WBNB pair with WBNB at index 1', async ()=> {
      mock({
        blockchain,
        provider,
        request: {
          to: exchange.factory.address,
          api: exchange.factory.api,
          method: 'getPair',
          params: ['0x297e4e5e59ad72b1b0a2fd446929e76117be0e0a', Blockchains[blockchain].wrapped.address],
          return: '0x386F5d5B48f791EcBc2fDAE94fE5ED3C27Fe6675'
        }
      })
      mock({
        blockchain,
        provider,
        request: {
          to: '0x386F5d5B48f791EcBc2fDAE94fE5ED3C27Fe6675',
          api: exchange.pair.api,
          method: 'getReserves',
          return: ['1115408461069632429', '10031', '1617377350']
        }
      })
      mock({
        blockchain,
        provider,
        request: {
          to: '0x386F5d5B48f791EcBc2fDAE94fE5ED3C27Fe6675',
          api: exchange.pair.api,
          method: 'token0',
          return: '0x297e4e5e59ad72b1b0a2fd446929e76117be0e0a'
        }
      })
      mock({
        blockchain,
        provider,
        request: {
          to: '0x386F5d5B48f791EcBc2fDAE94fE5ED3C27Fe6675',
          api: exchange.pair.api,
          method: 'token1',
          return: Blockchains[blockchain].wrapped.address
        }
      })
      let exists = await exchange.pathExists(['0x297e4e5e59ad72b1b0a2fd446929e76117be0e0a', Blockchains[blockchain].wrapped.address])
      expect(exists).toEqual(false)
    })

    it('does not consider path existing if pair does not have enough reserves for an WETH pair with WETH at index 0', async ()=> {
      mock({
        blockchain,
        provider,
        request: {
          to: exchange.factory.address,
          api: exchange.factory.api,
          method: 'getPair',
          params: ['0x297e4e5e59ad72b1b0a2fd446929e76117be0e0a', Blockchains[blockchain].wrapped.address],
          return: '0x386F5d5B48f791EcBc2fDAE94fE5ED3C27Fe6675'
        }
      })
      mock({
        blockchain,
        provider,
        request: {
          to: '0x386F5d5B48f791EcBc2fDAE94fE5ED3C27Fe6675',
          api: exchange.pair.api,
          method: 'getReserves',
          return: ['10031', '1115408461069632429', '1617377350']
        }
      })
      mock({
        blockchain,
        provider,
        request: {
          to: '0x386F5d5B48f791EcBc2fDAE94fE5ED3C27Fe6675',
          api: exchange.pair.api,
          method: 'token0',
          return: Blockchains[blockchain].wrapped.address
        }
      })
      mock({
        blockchain,
        provider,
        request: {
          to: '0x386F5d5B48f791EcBc2fDAE94fE5ED3C27Fe6675',
          api: exchange.pair.api,
          method: 'token1',
          return: '0x297e4e5e59ad72b1b0a2fd446929e76117be0e0a'
        }
      })
      let exists = await exchange.pathExists(['0x297e4e5e59ad72b1b0a2fd446929e76117be0e0a', Blockchains[blockchain].wrapped.address])
      expect(exists).toEqual(false)
    })

    describe('USD token', ()=>{

      beforeEach(()=>{
        mock({
          blockchain,
          provider,
          request: {
            to: Blockchains[blockchain].stables.usd[0],
            api: Token.ethereum.DEFAULT,
            method: 'decimals',
            return: '6'
          }
        })
      })

      it('does not consider path existing if pair does not have enough reserves for an USD pair with USD at index 1', async ()=> {
        mock({
          blockchain,
          provider,
          request: {
            to: exchange.factory.address,
            api: exchange.factory.api,
            method: 'getPair',
            params: ['0x297e4e5e59ad72b1b0a2fd446929e76117be0e0a', Blockchains[blockchain].stables.usd[0]],
            return: '0x386F5d5B48f791EcBc2fDAE94fE5ED3C27Fe6675'
          }
        })
        mock({
          blockchain,
          provider,
          request: {
            to: '0x386F5d5B48f791EcBc2fDAE94fE5ED3C27Fe6675',
            api: exchange.pair.api,
            method: 'getReserves',
            return: ['1115408461069632429', '10031', '1617377350']
          }
        })
        mock({
          blockchain,
          provider,
          request: {
            to: '0x386F5d5B48f791EcBc2fDAE94fE5ED3C27Fe6675',
            api: exchange.pair.api,
            method: 'token0',
            return: '0x297e4e5e59ad72b1b0a2fd446929e76117be0e0a'
          }
        })
        mock({
          blockchain,
          provider,
          request: {
            to: '0x386F5d5B48f791EcBc2fDAE94fE5ED3C27Fe6675',
            api: exchange.pair.api,
            method: 'token1',
            return: Blockchains[blockchain].stables.usd[0]
          }
        })
        let exists = await exchange.pathExists(['0x297e4e5e59ad72b1b0a2fd446929e76117be0e0a', Blockchains[blockchain].stables.usd[0]])
        expect(exists).toEqual(false)
      })

      it('does not consider path existing if pair does not have enough reserves for an USD pair with USD at index 0', async ()=> {
        mock({
          blockchain,
          provider,
          request: {
            to: exchange.factory.address,
            api: exchange.factory.api,
            method: 'getPair',
            params: ['0x297e4e5e59ad72b1b0a2fd446929e76117be0e0a', Blockchains[blockchain].stables.usd[0]],
            return: '0x386F5d5B48f791EcBc2fDAE94fE5ED3C27Fe6675'
          }
        })
        mock({
          blockchain,
          provider,
          request: {
            to: '0x386F5d5B48f791EcBc2fDAE94fE5ED3C27Fe6675',
            api: exchange.pair.api,
            method: 'getReserves',
            return: ['10031', '1000000', '1617377350']
          }
        })
        mock({
          blockchain,
          provider,
          request: {
            to: '0x386F5d5B48f791EcBc2fDAE94fE5ED3C27Fe6675',
            api: exchange.pair.api,
            method: 'token0',
            return: Blockchains[blockchain].stables.usd[0]
          }
        })
        mock({
          blockchain,
          provider,
          request: {
            to: '0x386F5d5B48f791EcBc2fDAE94fE5ED3C27Fe6675',
            api: exchange.pair.api,
            method: 'token1',
            return: '0x297e4e5e59ad72b1b0a2fd446929e76117be0e0a'
          }
        })
        let exists = await exchange.pathExists(['0x297e4e5e59ad72b1b0a2fd446929e76117be0e0a', Blockchains[blockchain].stables.usd[0]])
        expect(exists).toEqual(false)
      })
    })
  })
})
