import Route from 'src/classes/Route'
import Blockchains from '@depay/web3-blockchains'
import { ethers } from 'ethers'
import { find } from 'src'
import { mock, resetMocks, anything } from '@depay/web3-mock'
import { mockDecimals } from 'tests/mocks/token'
import { mockPair, mockAmounts } from 'tests/mocks/pancakeswap'
import { resetCache, getProvider } from '@depay/web3-client'
import { testRouting } from 'tests/helpers/testRouting'

describe('pancakeswap', () => {
  
  const blockchain = 'bsc'
  const accounts = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045']
  const exchange = find('bsc', 'pancakeswap')
  const pair = '0x804678fa97d91B974ec2af3c843270886528a9E6'
  const fromAddress = '0x5Af489c8786A018EC4814194dC8048be1007e390'
  const toAddress = '0x5Af489c8786A018EC4814194dC8048be1007e390'
  
  let provider
  beforeEach(async ()=>{
    resetMocks()
    resetCache()
    provider = await getProvider(blockchain)
    mock({ blockchain, accounts: { return: accounts } })
  })

  describe('basic routing', ()=>{

    it('does not try to find a route from and to the same token, as that doesnt make any sense on pancakeswap', async ()=> {

      mock(blockchain)

      const amountOut = 5
      const amountOutBN = ethers.utils.parseUnits(amountOut.toString(), 18)
      const amountIn = 5

      const route = await exchange.route({
        tokenIn: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        tokenOut: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
        amountInMax: amountIn,
        amountOut,
        fromAddress,
        toAddress
      })

      expect(route).toEqual(undefined)
    })

    it('returns undefined and does not fail or reject in case an error happens during the routing on pancakeswap', async ()=> {

      mock(blockchain)

      let tokenIn = '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82'
      let decimalsIn = 18
      let fetchedAmountIn = 43
      let fetchedAmountInBN = ethers.utils.parseUnits(fetchedAmountIn.toString(), decimalsIn)
      let tokenOut = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'
      let decimalsOut = 18
      let amountOut = 1
      let amountOutBN = ethers.utils.parseUnits(amountOut.toString(), decimalsOut)
      let path = [tokenIn, tokenOut]

      mockDecimals({ provider, blockchain, address: tokenIn, value: decimalsIn })
      mockDecimals({ provider, blockchain, address: tokenOut, value: decimalsOut })
      mockPair({ provider, tokenIn, tokenOut, pair })
      mock({
        provider,
        blockchain,
        request: {
          to: exchange.router.address,
          api: exchange.router.api,
          method: 'getAmountsIn',
          params: [amountOutBN, path],
          return: Error('Routing Error')
        }
      })

      let route = await exchange.route({
        tokenIn: tokenIn,
        tokenOut: tokenOut,
        amountOut,
        amountInMax: fetchedAmountIn,
        fromAddress,
        toAddress
      })

      expect(route).toEqual(undefined)
    })
  })

  describe('route token to token', ()=>{

    let tokenIn = '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82'
    let decimalsIn = 18
    let tokenOut = '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5'
    let decimalsOut = 18
    let path = [tokenIn, tokenOut]

    it('routes a token to token swap for given amountOut without given amountInMax on pancakeswap', async ()=> {

      let amountOut = 1
      let amountOutBN = ethers.utils.parseUnits(amountOut.toString(), decimalsOut)
      let fetchedAmountIn = 43
      let fetchedAmountInBN = ethers.utils.parseUnits(fetchedAmountIn.toString(), decimalsIn)
      let slippage = ethers.BigNumber.from('215000000000000000')

      mockPair({ provider, tokenIn, tokenOut, pair })
      mockAmounts({ method: 'getAmountsIn', params: [amountOutBN,path], amounts: [fetchedAmountInBN, amountOutBN] })

      await testRouting({
        blockchain,
        exchange,
        tokenIn,
        decimalsIn,
        tokenOut,
        decimalsOut,
        path,
        amountOut,
        pair,
        fromAddress,
        toAddress,
        transaction: {
          to: exchange.router.address,
          api: exchange.router.api,
          method: 'swapTokensForExactTokens',
          params: {
            amountInMax: fetchedAmountInBN.add(slippage),
            amountOut: amountOutBN,
            path: path,
            to: toAddress
          }
        }
      })
    });

    it('fixes lowercase token addresses given either as tokenIn or tokenOut', async ()=> {

      let amountOut = 1
      let amountOutBN = ethers.utils.parseUnits(amountOut.toString(), decimalsOut)
      let fetchedAmountIn = 43
      let fetchedAmountInBN = ethers.utils.parseUnits(fetchedAmountIn.toString(), decimalsIn)
      let slippage = ethers.BigNumber.from('215000000000000000')

      mockPair({ provider, tokenIn, tokenOut, pair })
      mockAmounts({ provider, method: 'getAmountsIn', params: [amountOutBN,path], amounts: [fetchedAmountInBN, amountOutBN] })

      await testRouting({
        blockchain,
        exchange,
        tokenIn: tokenIn.toLowerCase(),
        decimalsIn,
        tokenOut: tokenOut.toLowerCase(),
        decimalsOut,
        path,
        amountOut,
        pair,
        fromAddress,
        toAddress,
        transaction: {
          to: exchange.router.address,
          api: exchange.router.api,
          method: 'swapTokensForExactTokens',
          params: {
            amountInMax: fetchedAmountInBN.add(slippage),
            amountOut: amountOutBN,
            path: path,
            to: toAddress
          }
        }
      })
    });

    it('routes a token to token swap for given amountOutMin without given amountIn on pancakeswap', async ()=> {
      let amountOutMin = 1
      let amountOutMinBN = ethers.utils.parseUnits(amountOutMin.toString(), decimalsOut)
      let fetchedAmountIn = 43
      let fetchedAmountInBN = ethers.utils.parseUnits(fetchedAmountIn.toString(), decimalsIn)
      let slippage = ethers.BigNumber.from('215000000000000000')

      mockPair({ provider, tokenIn, tokenOut, pair })
      mockAmounts({ method: 'getAmountsIn', params: [amountOutMinBN, path], amounts: [fetchedAmountInBN, amountOutMinBN] })

      await testRouting({
        blockchain,
        exchange,
        tokenIn,
        decimalsIn,
        tokenOut,
        decimalsOut,
        path,
        amountOutMin,
        pair,
        fromAddress,
        toAddress,
        transaction: {
          to: exchange.router.address,
          api: exchange.router.api,
          method: 'swapExactTokensForTokens',
          params: {
            amountIn: fetchedAmountInBN.add(slippage),
            amountOutMin: amountOutMinBN,
            path: path,
            to: toAddress
          }
        }
      })
    });

    it('routes a token to token swap for given amountIn on pancakeswap', async ()=> {

      let amountIn = 1
      let amountInBN = ethers.utils.parseUnits(amountIn.toString(), decimalsIn)
      let fetchedAmountOut = 43
      let fetchedAmountOutBN = ethers.utils.parseUnits(fetchedAmountOut.toString(), decimalsOut)
      let path = [tokenIn, tokenOut]

      mockPair({ provider, tokenIn, tokenOut, pair })
      mockAmounts({ method: 'getAmountsOut', params: [amountInBN,path], amounts: [amountInBN, fetchedAmountOutBN] })

      await testRouting({
        blockchain,
        exchange,
        tokenIn,
        decimalsIn,
        tokenOut,
        decimalsOut,
        amountIn,
        path,
        pair,
        fromAddress,
        toAddress,
        transaction: {
          to: exchange.router.address,
          api: exchange.router.api,
          method: 'swapExactTokensForTokens',
          params: {
            amountIn: amountInBN,
            amountOutMin: fetchedAmountOutBN,
            path: [tokenIn, tokenOut],
            to: toAddress
          }
        }
      })
    });

    it('routes a token to token swap for given amountInMax without given amountOut on pancakeswap', async ()=> {

      let amountInMax = 1
      let amountInMaxBN = ethers.utils.parseUnits(amountInMax.toString(), decimalsIn)
      let fetchedAmountOut = 43
      let fetchedAmountOutBN = ethers.utils.parseUnits(fetchedAmountOut.toString(), decimalsOut)
      let path = [tokenIn, tokenOut]

      mockPair({ provider, tokenIn, tokenOut, pair })
      mockAmounts({ method: 'getAmountsOut', params: [amountInMaxBN, path], amounts: [amountInMaxBN, fetchedAmountOutBN] })

      await testRouting({
        blockchain,
        exchange,
        tokenIn,
        decimalsIn,
        tokenOut,
        decimalsOut,
        amountInMax,
        path,
        pair,
        fromAddress,
        toAddress,
        transaction: {
          to: exchange.router.address,
          api: exchange.router.api,
          method: 'swapTokensForExactTokens',
          params: {
            amountInMax: amountInMaxBN,
            amountOut: fetchedAmountOutBN,
            path: [tokenIn, tokenOut],
            to: toAddress
          }
        }
      })
    });

    it('routes a token to token swap for given amountOut on pancakeswap', async ()=> {

      let amountOut = 1
      let amountOutBN = ethers.utils.parseUnits(amountOut.toString(), decimalsOut)
      let amountInMax = 32
      let amountInMaxBN = ethers.utils.parseUnits(amountInMax.toString(), decimalsIn)
      let slippage = ethers.BigNumber.from('160000000000000000')
      let path = [tokenIn, tokenOut]

      mockPair({ provider, tokenIn, tokenOut, pair })
      mockAmounts({ method: 'getAmountsIn', params: [amountOutBN,path], amounts: [amountInMaxBN, amountOutBN] })

      await testRouting({
        blockchain,
        exchange,
        tokenIn,
        decimalsIn,
        tokenOut,
        decimalsOut,
        amountOut,
        path,
        pair,
        fromAddress,
        toAddress,
        transaction: {
          to: exchange.router.address,
          api: exchange.router.api,
          method: 'swapTokensForExactTokens',
          params: {
            amountInMax: amountInMaxBN.add(slippage),
            amountOut:  amountOutBN,
            path: [tokenIn, tokenOut],
            to: toAddress
          }
        },
      })
    });

    it('routes a token to token swap for given amountOutMin on pancakeswap', async ()=> {
      let amountOutMin = 1
      let amountOutMinBN = ethers.utils.parseUnits(amountOutMin.toString(), decimalsOut)
      let fetchedAmountIn = 32
      let fetchedAmountInBN = ethers.utils.parseUnits(fetchedAmountIn.toString(), decimalsIn)
      let slippage = ethers.BigNumber.from('160000000000000000')
      let path = [tokenIn, tokenOut]

      mockPair({ provider, tokenIn, tokenOut, pair })
      mockAmounts({ method: 'getAmountsIn', params: [amountOutMinBN, path], amounts: [fetchedAmountInBN, amountOutMinBN] })

      await testRouting({
        blockchain,
        exchange,
        tokenIn,
        decimalsIn,
        tokenOut,
        decimalsOut,
        amountOutMin,
        path,
        pair,
        fromAddress,
        toAddress,
        transaction: {
          to: exchange.router.address,
          api: exchange.router.api,
          method: 'swapExactTokensForTokens',
          params: {
            amountIn: fetchedAmountInBN.add(slippage),
            amountOutMin: amountOutMinBN,
            path: path,
            to: toAddress
          }
        },
      })
    });

    it('routes a token to token swap on pancakeswap also if the routing path is via another token A->B->C', async ()=> {
      let amountOutMin = 1
      let amountOutMinBN = ethers.utils.parseUnits(amountOutMin.toString(), decimalsOut)
      let fetchedAmountIn = 32
      let fetchedAmountInBN = ethers.utils.parseUnits(fetchedAmountIn.toString(), decimalsIn)
      let slippage = ethers.BigNumber.from('160000000000000000')
      let tokenVia = Blockchains[blockchain].wrapped.address
      let amountVia = 0.1
      let amountViaBN = ethers.utils.parseUnits(amountVia.toString(), CONSTANTS[blockchain].DECIMALS)

      path = [tokenIn, tokenVia, tokenOut]

      mockPair({ provider, tokenIn, tokenOut, pair: Blockchains[blockchain].zero })
      mockPair({ provider, tokenIn, tokenOut: tokenVia, pair: '0xef8cd6cb5c841a4f02986e8a8ab3cc545d1b8b6d' })
      mockPair({ provider, tokenIn: tokenOut, tokenOut: tokenVia, pair: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852' })
      mockAmounts({ method: 'getAmountsIn', params: [amountOutMinBN, path], amounts: [fetchedAmountInBN, amountViaBN, amountOutMinBN] })

      await testRouting({
        blockchain,
        exchange,
        tokenIn,
        decimalsIn,
        tokenOut,
        decimalsOut,
        path,
        amountOutMin,
        pair,
        fromAddress,
        toAddress,
        transaction: {
          to: exchange.router.address,
          api: exchange.router.api,
          method: 'swapExactTokensForTokens',
          params: {
            amountIn: fetchedAmountInBN.add(slippage),
            amountOutMin: amountOutMinBN,
            path: path,
            to: toAddress
          }
        }
      })
    })

    it('does not fail, but it provides no route if none was found', async ()=> {
      let amountOutMin = 1
      let amountOutMinBN = ethers.utils.parseUnits(amountOutMin.toString(), decimalsOut)
      let amountIn = 32
      let amountInBN = ethers.utils.parseUnits(amountIn.toString(), decimalsIn)

      mockDecimals({ provider, blockchain, address: tokenIn, value: decimalsIn })
      mockDecimals({ provider, blockchain, address: tokenOut, value: decimalsOut })
      
      mockPair({ provider, tokenIn, tokenOut: Blockchains[blockchain].stables.usd[0], pair: Blockchains[blockchain].zero })
      mockPair({ provider, tokenIn, tokenOut, pair: Blockchains[blockchain].zero })
      mockPair({ provider, tokenIn, tokenOut: Blockchains[blockchain].wrapped.address, pair: Blockchains[blockchain].zero })

      let route = await exchange.route({
        tokenIn,
        tokenOut,
        amountIn,
        amountOutMin,
        fromAddress,
        toAddress
      })

      expect(route).toEqual(undefined)
    })

    it('routes a token to token swap on PancakeSwap also if the routing path is via TOKEN_A->USD->WRAPPED->TOKEN_B', async ()=> {
      let amountOutMin = 1
      let amountOutMinBN = ethers.utils.parseUnits(amountOutMin.toString(), decimalsOut)
      let fetchedAmountIn = 32
      let fetchedAmountInBN = ethers.utils.parseUnits(fetchedAmountIn.toString(), decimalsIn)
      let slippage = ethers.BigNumber.from('160000000000000000')
      let amountWRAPPED = 0.1
      let amountWRAPPEDBN = ethers.utils.parseUnits(amountWRAPPED.toString(), CONSTANTS[blockchain].DECIMALS)
      let amountUSD = 420
      let amountUSDBN = ethers.utils.parseUnits(amountUSD.toString(), CONSTANTS[blockchain].DECIMALS)

      path = [tokenIn, Blockchains[blockchain].stables.usd[0], Blockchains[blockchain].wrapped.address, tokenOut]

      mockDecimals({ provider, blockchain, address: Blockchains[blockchain].stables.usd[0], value: CONSTANTS[blockchain].DECIMALS })
      mockPair({ provider, tokenIn, tokenOut, pair: Blockchains[blockchain].zero })
      mockPair({ provider, tokenIn, tokenOut: Blockchains[blockchain].wrapped.address, pair: Blockchains[blockchain].zero })
      mockPair({ provider, tokenIn, tokenOut: Blockchains[blockchain].stables.usd[0], pair: '0xef8cd6cb5c841a4f02986e8a8ab3cc545d1b8b6d' })
      mockPair({ provider, tokenIn: Blockchains[blockchain].wrapped.address, tokenOut , pair: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852' })
      mockAmounts({ provider, method: 'getAmountsIn', params: [amountOutMinBN, path], amounts: [fetchedAmountInBN, amountUSDBN, amountWRAPPEDBN, amountOutMinBN] })

      await testRouting({
        blockchain,
        exchange,
        tokenIn,
        decimalsIn,
        tokenOut,
        decimalsOut,
        path,
        amountOutMin,
        pair,
        fromAddress,
        toAddress,
        transaction: {
          to: exchange.router.address,
          api: exchange.router.api,
          method: 'swapExactTokensForTokens',
          params: {
            amountIn: fetchedAmountInBN.add(slippage),
            amountOutMin: amountOutMinBN,
            path: path,
            to: toAddress
          }
        }
      })
    })

    it('routes a token to token swap on PancakeSwap also if the routing path is via TOKEN_A->WRAPPED->USD->TOKEN_B', async ()=> {
      let amountOutMin = 1
      let amountOutMinBN = ethers.utils.parseUnits(amountOutMin.toString(), decimalsOut)
      let fetchedAmountIn = 32
      let fetchedAmountInBN = ethers.utils.parseUnits(fetchedAmountIn.toString(), decimalsIn)
      let slippage = ethers.BigNumber.from('160000000000000000')
      let amountWRAPPED = 0.1
      let amountWRAPPEDBN = ethers.utils.parseUnits(amountWRAPPED.toString(), CONSTANTS[blockchain].DECIMALS)
      let amountUSD = 420
      let amountUSDBN = ethers.utils.parseUnits(amountUSD.toString(), CONSTANTS[blockchain].DECIMALS)

      path = [tokenIn, Blockchains[blockchain].wrapped.address, Blockchains[blockchain].stables.usd[0], tokenOut]

      mockDecimals({ provider, blockchain, address: Blockchains[blockchain].stables.usd[0], value: CONSTANTS[blockchain].DECIMALS })
      mockPair({ provider, tokenIn, tokenOut, pair: Blockchains[blockchain].zero })
      mockPair({ provider, tokenIn, tokenOut: Blockchains[blockchain].stables.usd[0], pair: Blockchains[blockchain].zero })
      mockPair({ provider, tokenIn, tokenOut: Blockchains[blockchain].wrapped.address, pair: '0xef8cd6cb5c841a4f02986e8a8ab3cc545d1b8b6d' })
      mockPair({ provider, tokenIn: tokenOut, tokenOut: Blockchains[blockchain].wrapped.address, pair: Blockchains[blockchain].zero })
      mockPair({ provider, tokenIn: Blockchains[blockchain].stables.usd[0], tokenOut, pair: '0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852' })
      mockAmounts({ provider, method: 'getAmountsIn', params: [amountOutMinBN, path], amounts: [fetchedAmountInBN, amountWRAPPEDBN, amountUSDBN, amountOutMinBN] })

      await testRouting({
        blockchain,
        exchange,
        tokenIn,
        decimalsIn,
        tokenOut,
        decimalsOut,
        path,
        amountOutMin,
        pair,
        fromAddress,
        toAddress,
        transaction: {
          to: exchange.router.address,
          api: exchange.router.api,
          method: 'swapExactTokensForTokens',
          params: {
            amountIn: fetchedAmountInBN.add(slippage),
            amountOutMin: amountOutMinBN,
            path: path,
            to: toAddress
          }
        }
      })
    })
  })

  describe('route BNB to token', ()=>{

    let tokenIn = CONSTANTS[blockchain].NATIVE
    let decimalsIn = CONSTANTS[blockchain].DECIMALS
    let tokenOut = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'
    let decimalsOut = 18
    let path = [tokenIn, Blockchains[blockchain].wrapped.address, tokenOut]

    it('routes a BNB to token swap for given amountOut on pancakeswap', async ()=> {

      let amountOut = 1
      let amountOutBN = ethers.utils.parseUnits(amountOut.toString(), decimalsOut)
      let fetchedAmountIn = 43
      let fetchedAmountInBN = ethers.utils.parseUnits(fetchedAmountIn.toString(), decimalsIn)
      let slippage = ethers.BigNumber.from('215000000000000000')

      mockPair({ provider, tokenIn: Blockchains[blockchain].wrapped.address, tokenOut, pair })
      mockAmounts({ method: 'getAmountsIn', params: [amountOutBN,[Blockchains[blockchain].wrapped.address,tokenOut]], amounts: [fetchedAmountInBN, amountOutBN] })

      await testRouting({
        blockchain,
        exchange,
        tokenIn,
        decimalsIn,
        tokenOut,
        decimalsOut,
        path,
        amountOut,
        pair,
        fromAddress,
        toAddress,
        transaction: {
          to: exchange.router.address,
          api: exchange.router.api,
          method: 'swapETHForExactTokens',
          params: {
            amountOut: amountOutBN,
            path: [Blockchains[blockchain].wrapped.address, tokenOut],
            to: toAddress
          },
          value: fetchedAmountInBN.add(slippage)
        }
      })
    });

    it('routes a BNB to token swap for given amountIn on pancakeswap', async ()=> {

      let amountIn = 1
      let amountInBN = ethers.utils.parseUnits(amountIn.toString(), decimalsIn)
      let fetchedAmountOut = 43
      let fetchedAmountOutBN = ethers.utils.parseUnits(fetchedAmountOut.toString(), decimalsOut)
      let path = [tokenIn, Blockchains[blockchain].wrapped.address, tokenOut]

      mockPair({ provider, tokenIn: Blockchains[blockchain].wrapped.address, tokenOut, pair })
      mockAmounts({ method: 'getAmountsOut', params: [amountInBN,[Blockchains[blockchain].wrapped.address,tokenOut]], amounts: [amountInBN, fetchedAmountOutBN] })

      await testRouting({
        blockchain,
        exchange,
        tokenIn,
        decimalsIn,
        tokenOut,
        decimalsOut,
        amountIn,
        path,
        pair,
        fromAddress,
        toAddress,
        transaction: {
          to: exchange.router.address,
          api: exchange.router.api,
          method: 'swapExactETHForTokens',
          params: {
            amountOutMin: fetchedAmountOutBN,
            path: [Blockchains[blockchain].wrapped.address, tokenOut],
            to: toAddress
          },
          value: amountInBN
        }
      })
    });

    it('routes a BNB to token swap for given amountOut on pancakeswap', async ()=> {

      let amountOut = 1
      let amountOutBN = ethers.utils.parseUnits(amountOut.toString(), decimalsOut)
      let amountInMax = 32
      let amountInMaxBN = ethers.utils.parseUnits(amountInMax.toString(), decimalsIn)
      let slippage = ethers.BigNumber.from('160000000000000000')
      let path = [tokenIn, Blockchains[blockchain].wrapped.address, tokenOut]

      mockPair({ provider, tokenIn: Blockchains[blockchain].wrapped.address, tokenOut, pair })
      mockAmounts({ method: 'getAmountsIn', params: [amountOutBN,[Blockchains[blockchain].wrapped.address,tokenOut]], amounts: [amountInMaxBN, amountOutBN] })

      await testRouting({
        blockchain,
        exchange,
        tokenIn,
        decimalsIn,
        tokenOut,
        decimalsOut,
        amountOut,
        path,
        pair,
        fromAddress,
        toAddress,
        transaction: {
          to: exchange.router.address,
          api: exchange.router.api,
          method: 'swapETHForExactTokens',
          params: {
            amountOut:  amountOutBN,
            path: [Blockchains[blockchain].wrapped.address, tokenOut],
            to: toAddress
          },
          value: amountInMaxBN.add(slippage)
        },
      })
    });

    it('routes a BNB to token swap for given amountOutMin on pancakeswap', async ()=> {
      let amountOutMin = 1
      let amountOutMinBN = ethers.utils.parseUnits(amountOutMin.toString(), decimalsOut)
      let fetchedAmountIn = 32
      let fetchedAmountInBN = ethers.utils.parseUnits(fetchedAmountIn.toString(), decimalsIn)
      let slippage = ethers.BigNumber.from('160000000000000000')
      let path = [tokenIn, Blockchains[blockchain].wrapped.address, tokenOut]

      mockPair({ provider, tokenIn: Blockchains[blockchain].wrapped.address, tokenOut, pair })
      mockAmounts({ method: 'getAmountsIn', params: [amountOutMinBN, [Blockchains[blockchain].wrapped.address,tokenOut]], amounts: [fetchedAmountInBN, amountOutMinBN] })

      await testRouting({
        blockchain,
        exchange,
        tokenIn,
        decimalsIn,
        tokenOut,
        decimalsOut,
        amountOutMin,
        path,
        pair,
        fromAddress,
        toAddress,
        transaction: {
          to: exchange.router.address,
          api: exchange.router.api,
          method: 'swapExactETHForTokens',
          params: {
            amountOutMin: amountOutMinBN,
            path: [Blockchains[blockchain].wrapped.address,tokenOut],
            to: toAddress
          },
          value: fetchedAmountInBN.add(slippage)
        },
      })
    });
  })

  describe('route token to BNB', ()=>{

    let tokenIn = '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82'
    let decimalsIn = 18
    let tokenOut = CONSTANTS[blockchain].NATIVE
    let decimalsOut = CONSTANTS[blockchain].DECIMALS
    let path = [tokenIn, Blockchains[blockchain].wrapped.address, tokenOut]

    it('routes a token to BNB swap for given amountOut without given amountInMax on pancakeswap', async ()=> {

      let amountOut = 1
      let amountOutBN = ethers.utils.parseUnits(amountOut.toString(), decimalsOut)
      let fetchedAmountIn = 43
      let fetchedAmountInBN = ethers.utils.parseUnits(fetchedAmountIn.toString(), decimalsIn)
      let slippage = ethers.BigNumber.from('215000000000000000')

      mockPair({ provider, tokenIn, tokenOut: Blockchains[blockchain].wrapped.address, pair })
      mockAmounts({ method: 'getAmountsIn', params: [amountOutBN,[tokenIn, Blockchains[blockchain].wrapped.address]], amounts: [fetchedAmountInBN, amountOutBN] })

      await testRouting({
        blockchain,
        exchange,
        tokenIn,
        decimalsIn,
        tokenOut,
        decimalsOut,
        path,
        amountOut,
        pair,
        fromAddress,
        toAddress,
        transaction: {
          to: exchange.router.address,
          api: exchange.router.api,
          method: 'swapTokensForExactETH',
          params: {
            amountInMax: fetchedAmountInBN.add(slippage),
            amountOut: amountOutBN,
            path: [tokenIn, Blockchains[blockchain].wrapped.address],
            to: toAddress
          }
        }
      })
    });

    it('routes a token to BNB swap for given amountIn on pancakeswap', async ()=> {

      let amountIn = 1
      let amountInBN = ethers.utils.parseUnits(amountIn.toString(), decimalsIn)
      let fetchedAmountOut = 43
      let fetchedAmountOutBN = ethers.utils.parseUnits(fetchedAmountOut.toString(), decimalsOut)
      let path = [tokenIn, Blockchains[blockchain].wrapped.address, tokenOut]

      mockPair({ provider, tokenIn, tokenOut: Blockchains[blockchain].wrapped.address, pair })
      mockAmounts({ method: 'getAmountsOut', params: [amountInBN,[tokenIn, Blockchains[blockchain].wrapped.address]], amounts: [amountInBN, fetchedAmountOutBN] })

      await testRouting({
        blockchain,
        exchange,
        tokenIn,
        decimalsIn,
        tokenOut,
        decimalsOut,
        amountIn,
        path,
        pair,
        fromAddress,
        toAddress,
        transaction: {
          to: exchange.router.address,
          api: exchange.router.api,
          method: 'swapExactTokensForETH',
          params: {
            amountIn: amountInBN,
            amountOutMin: fetchedAmountOutBN,
            path: [tokenIn, Blockchains[blockchain].wrapped.address],
            to: toAddress
          }
        }
      })
    });

    it('routes a token to BNB swap for given amountOut on pancakeswap', async ()=> {

      let amountOut = 1
      let amountOutBN = ethers.utils.parseUnits(amountOut.toString(), decimalsOut)
      let amountInMax = 32
      let amountInMaxBN = ethers.utils.parseUnits(amountInMax.toString(), decimalsIn)
      let slippage = ethers.BigNumber.from('160000000000000000')
      let path = [tokenIn, Blockchains[blockchain].wrapped.address, tokenOut]

      mockPair({ provider, tokenIn, tokenOut: Blockchains[blockchain].wrapped.address, pair })
      mockAmounts({ method: 'getAmountsIn', params: [amountOutBN,[tokenIn, Blockchains[blockchain].wrapped.address]], amounts: [amountInMaxBN, amountOutBN] })

      await testRouting({
        blockchain,
        exchange,
        tokenIn,
        decimalsIn,
        tokenOut,
        decimalsOut,
        amountOut,
        path,
        pair,
        fromAddress,
        toAddress,
        transaction: {
          to: exchange.router.address,
          api: exchange.router.api,
          method: 'swapTokensForExactETH',
          params: {
            amountInMax: amountInMaxBN.add(slippage),
            amountOut:  amountOutBN,
            path: [tokenIn, Blockchains[blockchain].wrapped.address],
            to: toAddress
          }
        },
      })
    });

    it('routes a token to BNB swap for given amountIn and amountOutMin on pancakeswap', async ()=> {
      let amountOutMin = 1
      let amountOutMinBN = ethers.utils.parseUnits(amountOutMin.toString(), decimalsOut)
      let fetchedAmountIn = 32
      let fetchedAmountInBN = ethers.utils.parseUnits(fetchedAmountIn.toString(), decimalsIn)
      let slippage = ethers.BigNumber.from('160000000000000000')
      let path = [tokenIn, Blockchains[blockchain].wrapped.address, tokenOut]

      mockPair({ provider, tokenIn, tokenOut: Blockchains[blockchain].wrapped.address, pair })
      mockAmounts({ method: 'getAmountsIn', params: [amountOutMinBN, [tokenIn, Blockchains[blockchain].wrapped.address]], amounts: [fetchedAmountInBN, amountOutMinBN] })

      await testRouting({
        blockchain,
        exchange,
        tokenIn,
        decimalsIn,
        tokenOut,
        decimalsOut,
        amountOutMin,
        path,
        pair,
        fromAddress,
        toAddress,
        transaction: {
          to: exchange.router.address,
          api: exchange.router.api,
          method: 'swapExactTokensForETH',
          params: {
            amountIn: fetchedAmountInBN.add(slippage),
            amountOutMin: amountOutMinBN,
            path: [tokenIn, Blockchains[blockchain].wrapped.address],
            to: toAddress
          }
        },
      })
    });
  })
});
