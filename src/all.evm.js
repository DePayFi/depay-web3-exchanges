import pancakeswap from './exchanges/pancakeswap/index.evm'
import quickswap from './exchanges/quickswap/index.evm'
import uniswap_v2 from './exchanges/uniswap_v2/index.evm'
import wagyuswap from './exchanges/wagyuswap/index.evm'

let all = {
  ethereum: [uniswap_v2],
  bsc: [pancakeswap],
  polygon: [quickswap],
  solana: [],
  velas: [wagyuswap],
}

export default all
