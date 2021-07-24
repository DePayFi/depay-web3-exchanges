import { ethers } from 'ethers'
import { mockDecimals } from '../mocks/token'
import { mock, normalize } from 'depay-web3mock'

function expectRoute({
  blockchain,
  route,
  tokenIn,
  tokenOut,
  path,
  amountOutBN,
  amountInBN,
  amountOutMinBN,
  amountInMaxBN,
  fromAddress,
  toAddress,
  exchange,
  transaction
}) {
  expect(route.tokenIn).toEqual(tokenIn)
  expect(route.tokenOut).toEqual(tokenOut)
  expect(route.path).toEqual(path)
  if(typeof amountOutBN !== 'undefined') { expect(route.amountOut).toEqual(amountOutBN) }
  if(typeof amountInBN !== 'undefined') { expect(route.amountIn).toEqual(amountInBN) }
  if(typeof amountOutMinBN !== 'undefined') { expect(route.amountOutMin).toEqual(amountOutMinBN) }
  if(typeof amountInMaxBN !== 'undefined') { expect(route.amountInMax).toEqual(amountInMaxBN) }
  expect(route.fromAddress).toEqual(fromAddress)
  expect(route.toAddress).toEqual(toAddress)
  expect(route.exchange).toEqual(exchange)
  expect(route.transaction.blockchain).toEqual(blockchain)
  expect(route.transaction.address).toEqual(transaction.to)
  expect(route.transaction.api).toEqual(transaction.api)
  expect(route.transaction.method).toEqual(transaction.method)
  expect(route.transaction.params.deadline).toBeDefined()
  expect(route.transaction.value).toEqual(transaction.value)
  expect(
    Object.keys(transaction.params).every((key)=>{
      return JSON.stringify(normalize(route.transaction.params[key])) == JSON.stringify(normalize(transaction.params[key]))
    })
  ).toEqual(true)
}

async function testRouting({
  blockchain,
  exchange,
  tokenIn,
  decimalsIn,
  tokenOut,
  decimalsOut,
  path,
  amountIn,
  amountInMax,
  amountOut,
  amountOutMin,
  pair,
  fromAddress,
  toAddress,
  transaction
}) {
  let amountInBN = typeof amountIn === 'undefined' ? undefined : ethers.utils.parseUnits(amountIn.toString(), decimalsIn)
  let amountInMaxBN = typeof amountInMax === 'undefined' ? undefined : ethers.utils.parseUnits(amountInMax.toString(), decimalsIn)
  let amountOutBN = typeof amountOut === 'undefined' ? undefined : ethers.utils.parseUnits(amountOut.toString(), decimalsOut)
  let amountOutMinBN = typeof amountOutMin === 'undefined' ? undefined : ethers.utils.parseUnits(amountOutMin.toString(), decimalsOut)

  mockDecimals({ address: tokenIn, value: decimalsIn })
  mockDecimals({ address: tokenOut, value: decimalsOut })

  let route = await exchange.route({
    fromAddress,
    toAddress,
    amountIn,
    amountInMax,
    amountOut,
    amountOutMin,
    tokenIn,
    tokenOut
  })

  expectRoute({
    blockchain,
    route,
    tokenIn,
    tokenOut,
    path,
    amountInBN,
    amountInMaxBN,
    amountOutBN,
    amountOutMinBN,
    fromAddress,
    toAddress, 
    exchange,
    transaction
  })
  
  let transactionMock = mock({ blockchain, transaction })

  await route.transaction.submit()

  expect(transactionMock).toHaveBeenCalled()
}

export {
  testRouting
}
