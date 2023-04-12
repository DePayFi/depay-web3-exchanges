/*#if _EVM

/*#elif _SOLANA

import { request } from '@depay/web3-client-solana'

//#else */

import { request } from '@depay/web3-client'

//#endif

import exchange from '../../basics'
import { Buffer, PublicKey } from '@depay/solana-web3.js'
import { TICK_ARRAY_LAYOUT } from '../../apis'

const MAX_SWAP_TICK_ARRAYS = 3
const MAX_TICK_INDEX = 443636 // i32
const MIN_TICK_INDEX = -443636 // i32
const TICK_ARRAY_SIZE = 88 // i32

const getStartTickIndex = (tickIndex, tickSpacing, offset) => {
  const realIndex = Math.floor(tickIndex / tickSpacing / TICK_ARRAY_SIZE)
  const startTickIndex = (realIndex + offset) * tickSpacing * TICK_ARRAY_SIZE

  const ticksInArray = TICK_ARRAY_SIZE * tickSpacing;
  const minTickIndex = MIN_TICK_INDEX - ((MIN_TICK_INDEX % ticksInArray) + ticksInArray)
  if(startTickIndex < minTickIndex) { throw(`startTickIndex is too small - - ${startTickIndex}`) }
  if(startTickIndex > MAX_TICK_INDEX) { throw(`startTickIndex is too large - ${startTickIndex}`) }
  return startTickIndex
}

const getTickArrays = async ({ 
  account, // stale whirlpool account
  freshWhirlpoolData, // fresh whirlpool account data
  aToB, // direction
})=>{

  const tickSpacing = freshWhirlpoolData.tickSpacing
  const tickCurrentIndex = freshWhirlpoolData.tickCurrentIndex
  const shift = aToB ? 0 : tickSpacing

  let offset = 0
  let tickArrayAddresses = []
  for (let i = 0; i < MAX_SWAP_TICK_ARRAYS; i++) {
    let startIndex
    try {
      startIndex = getStartTickIndex(tickCurrentIndex + shift, tickSpacing, offset)
    } catch {
      return tickArrayAddresses
    }

    const pda = (
      await PublicKey.findProgramAddress([
          Buffer.from('tick_array'),
          account.pubkey.toBuffer(),
          Buffer.from(startIndex.toString())
        ],
        new PublicKey(exchange.router.v1.address)
      )
    )[0]
    tickArrayAddresses.push(pda)
    offset = aToB ? offset - 1 : offset + 1
  }

  return await Promise.all(tickArrayAddresses.map(async(address, index) => {

    const data = await request({ blockchain: 'solana' , address: address.toString(), api: TICK_ARRAY_LAYOUT, cache: 10 })

    return {
      address,
      data
    }
  }))
}

export {
  getTickArrays,
  MAX_SWAP_TICK_ARRAYS,
  MAX_TICK_INDEX,
  MIN_TICK_INDEX,
  TICK_ARRAY_SIZE,      
}
