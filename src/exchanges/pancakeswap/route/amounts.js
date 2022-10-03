import PancakeSwap from '../basics'
import { fixPath } from './path'
import { request } from '@depay/web3-client'

let getAmountOut = ({ path, amountIn, tokenIn, tokenOut }) => {
  return new Promise((resolve) => {
    request({
      blockchain: 'bsc',
      address: PancakeSwap.router.address,
      method: 'getAmountsOut',
      api: PancakeSwap.router.api,
      params: {
        amountIn: amountIn,
        path: fixPath(path),
      },
    })
    .then((amountsOut)=>{
      resolve(amountsOut[amountsOut.length - 1])
    })
    .catch(()=>resolve())
  })
}

let getAmountIn = ({ path, amountOut, block }) => {
  return new Promise((resolve) => {
    request({
      blockchain: 'bsc',
      address: PancakeSwap.router.address,
      method: 'getAmountsIn',
      api: PancakeSwap.router.api,
      params: {
        amountOut: amountOut,
        path: fixPath(path),
      },
      block
    })
    .then((amountsIn)=>resolve(amountsIn[0]))
    .catch(()=>resolve())
  })
}

let getAmounts = async ({
  path,
  tokenIn,
  tokenOut,
  amountOut,
  amountIn,
  amountInMax,
  amountOutMin
}) => {
  if (amountOut) {
    amountIn = await getAmountIn({ path, amountOut, tokenIn, tokenOut })
    if (amountIn == undefined || amountInMax && amountIn.gt(amountInMax)) {
      return {}
    } else if (amountInMax === undefined) {
      amountInMax = amountIn
    }
  } else if (amountIn) {
    amountOut = await getAmountOut({ path, amountIn, tokenIn, tokenOut })
    if (amountOut == undefined || amountOutMin && amountOut.lt(amountOutMin)) {
      return {}
    } else if (amountOutMin === undefined) {
      amountOutMin = amountOut
    }
  } else if(amountOutMin) {
    amountIn = await getAmountIn({ path, amountOut: amountOutMin, tokenIn, tokenOut })
    if (amountIn == undefined || amountInMax && amountIn.gt(amountInMax)) {
      return {}
    } else if (amountInMax === undefined) {
      amountInMax = amountIn
    }
  } else if(amountInMax) {
    amountOut = await getAmountOut({ path, amountIn: amountInMax, tokenIn, tokenOut })
    if (amountOut == undefined ||amountOutMin && amountOut.lt(amountOutMin)) {
      return {}
    } else if (amountOutMin === undefined) {
      amountOutMin = amountOut
    }
  }
  return { amountOut, amountIn, amountInMax, amountOutMin }
}

export {
  getAmounts,
  getAmountIn
}
