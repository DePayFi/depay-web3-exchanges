import Blockchains from '@depay/web3-blockchains'
import Exchange from '../classes/Exchange'
import TraderJoeV2_1 from '../platforms/evm/trader_joe_v2_1'

const exchange = {

  name: 'trader_joe_v2_1',
  label: 'Trader Joe v2.1',
  logo: 'data:image/png;base64,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',
  
  slippage: true,
  
  blockchains: ['avalanche'],
  
  avalanche: {
    router: {
      address: '0xb4315e873dBcf96Ffd0acd8EA43f689D8c20fB30',
      api: TraderJoeV2_1.ROUTER
    },
    factory: {
      address: '0x8e42f2F4101563bF679975178e880FD87d3eFd4e',
      api: TraderJoeV2_1.FACTORY
    },
    pair: {
      api: TraderJoeV2_1.PAIR
    },
    quoter: {
      address: '0x64b57F4249aA99a812212cee7DAEFEDC40B203cD',
      api: TraderJoeV2_1.QUOTER
    }
  }
  
}

export default (scope)=>{
  
  return new Exchange(

    Object.assign(exchange, {
      scope,
      findPath: ({ blockchain, tokenIn, tokenOut, amountIn, amountOut, amountInMax, amountOutMin })=>
        TraderJoeV2_1.findPath({ blockchain, exchange, tokenIn, tokenOut, amountIn, amountOut, amountInMax, amountOutMin }),
      pathExists: (blockchain, path)=>
        TraderJoeV2_1.pathExists(blockchain, exchange, path),
      getAmounts: ({ blockchain, path, pools, block, tokenIn, tokenOut, amountOut, amountIn, amountInMax, amountOutMin })=>
        TraderJoeV2_1.getAmounts(blockchain, exchange, { path, pools, block, tokenIn, tokenOut, amountOut, amountIn, amountInMax, amountOutMin }),
      getTransaction: (...args)=> TraderJoeV2_1.getTransaction(...args),
    })
  )
}
