/*#if _EVM

/*#elif _SOLANA

import { request, getProvider } from '@depay/web3-client-solana'
import { Token } from '@depay/web3-tokens-solana'

//#else */

import { request, getProvider } from '@depay/web3-client'
import { Token } from '@depay/web3-tokens'

//#endif

import Blockchains from '@depay/web3-blockchains'
import exchange from '../basics'
import { Buffer, BN, Transaction, TransactionInstruction, SystemProgram, PublicKey, Keypair, struct, u64, u128, bool } from '@depay/solana-web3.js'
import { fixPath } from './path'
import { getBestPair } from './pairs'

const blockchain = Blockchains.solana
const SWAP_INSTRUCTION = new BN("14449647541112719096")
const TWO_HOP_SWAP_INSTRUCTION = new BN("16635068063392030915")

const createTokenAccountIfNotExisting = async ({ instructions, owner, token, account })=>{
  let outAccountExists
  try{ outAccountExists = !!(await request({ blockchain: 'solana', address: account.toString() })) } catch {}
  if(!outAccountExists) {
    instructions.push(
      await Token.solana.createAssociatedTokenAccountInstruction({
        token,
        owner,
        payer: owner,
      })
    )
  }
}

const getTwoHopSwapInstructionKeys = async ({
  fromAddress,
  poolOne,
  tickArraysOne,
  tokenAccountOneA,
  tokenVaultOneA,
  tokenAccountOneB,
  tokenVaultOneB,
  poolTwo,
  tickArraysTwo,
  tokenAccountTwoA,
  tokenVaultTwoA,
  tokenAccountTwoB,
  tokenVaultTwoB,
})=> {

  return [
    // token_program
    { pubkey: new PublicKey(Token.solana.TOKEN_PROGRAM), isWritable: false, isSigner: false },
    // token_authority
    { pubkey: new PublicKey(fromAddress), isWritable: false, isSigner: true },
    // whirlpool_one
    { pubkey: new PublicKey(poolOne.toString()), isWritable: true, isSigner: false },
    // whirlpool_two
    { pubkey: new PublicKey(poolTwo.toString()), isWritable: true, isSigner: false },
    // token_owner_account_one_a
    { pubkey: new PublicKey(tokenAccountOneA.toString()), isWritable: true, isSigner: false },
    // token_vault_one_a
    { pubkey: new PublicKey(tokenVaultOneA.toString()), isWritable: true, isSigner: false },
    // token_owner_account_one_b
    { pubkey: new PublicKey(tokenAccountOneB.toString()), isWritable: true, isSigner: false },
    // token_vault_one_b
    { pubkey: new PublicKey(tokenVaultOneB.toString()), isWritable: true, isSigner: false },
    // token_owner_account_two_a
    { pubkey: new PublicKey(tokenAccountTwoA.toString()), isWritable: true, isSigner: false },
    // token_vault_two_a
    { pubkey: new PublicKey(tokenVaultTwoA.toString()), isWritable: true, isSigner: false },
    // token_owner_account_two_b
    { pubkey: new PublicKey(tokenAccountTwoB.toString()), isWritable: true, isSigner: false },
    // token_vault_two_b
    { pubkey: new PublicKey(tokenVaultTwoB.toString()), isWritable: true, isSigner: false },
    // tick_array_one_0
    { pubkey: tickArraysOne[0].address, isWritable: true, isSigner: false },
    // tick_array_one_1
    { pubkey: tickArraysOne[1].address, isWritable: true, isSigner: false },
    // tick_array_one_2
    { pubkey: tickArraysOne[2].address, isWritable: true, isSigner: false },
    // tick_array_two_0
    { pubkey: tickArraysTwo[0].address, isWritable: true, isSigner: false },
    // tick_array_two_1
    { pubkey: tickArraysTwo[1].address, isWritable: true, isSigner: false },
    // tick_array_two_2
    { pubkey: tickArraysTwo[2].address, isWritable: true, isSigner: false },
    // oracle_one
    { pubkey: (await PublicKey.findProgramAddress([ Buffer.from('oracle'), new PublicKey(poolOne.toString()).toBuffer() ], new PublicKey(exchange.router.v1.address)))[0], isWritable: false, isSigner: false },
    // oracle_two
    { pubkey: (await PublicKey.findProgramAddress([ Buffer.from('oracle'), new PublicKey(poolTwo.toString()).toBuffer() ], new PublicKey(exchange.router.v1.address)))[0], isWritable: false, isSigner: false },
  ]
}
const getTwoHopSwapInstructionData = ({
  amount,
  otherAmountThreshold,
  amountSpecifiedIsInput,
  aToBOne,
  aToBTwo,
  sqrtPriceLimitOne,
  sqrtPriceLimitTwo,
})=> {
  let LAYOUT, data
  
  LAYOUT = struct([
    u64("anchorDiscriminator"),
    u64("amount"),
    u64("otherAmountThreshold"),
    bool("amountSpecifiedIsInput"),
    bool("aToBOne"),
    bool("aToBTwo"),
    u128("sqrtPriceLimitOne"),
    u128("sqrtPriceLimitTwo"),
  ])
  data = Buffer.alloc(LAYOUT.span)
  LAYOUT.encode(
    {
      anchorDiscriminator: TWO_HOP_SWAP_INSTRUCTION,
      amount: new BN(amount.toString()),
      otherAmountThreshold: new BN(otherAmountThreshold.toString()),
      amountSpecifiedIsInput,
      aToBOne,
      aToBTwo,
      sqrtPriceLimitOne,
      sqrtPriceLimitTwo,
    },
    data,
  )

  return data
}

const getSwapInstructionKeys = async ({
  fromAddress,
  pool,
  tokenAccountA,
  tokenVaultA,
  tokenAccountB,
  tokenVaultB,
  tickArrays,
})=> {

  return [
    // token_program
    { pubkey: new PublicKey(Token.solana.TOKEN_PROGRAM), isWritable: false, isSigner: false },
    // token_authority
    { pubkey: new PublicKey(fromAddress), isWritable: false, isSigner: true },
    // whirlpool
    { pubkey: new PublicKey(pool.toString()), isWritable: true, isSigner: false },
    // token_owner_account_a
    { pubkey: new PublicKey(tokenAccountA.toString()), isWritable: true, isSigner: false },
    // token_vault_a
    { pubkey: new PublicKey(tokenVaultA.toString()), isWritable: true, isSigner: false },
    // token_owner_account_b
    { pubkey: new PublicKey(tokenAccountB.toString()), isWritable: true, isSigner: false },
    // token_vault_b
    { pubkey: new PublicKey(tokenVaultB.toString()), isWritable: true, isSigner: false },
    // tick_array_0
    { pubkey: tickArrays[0].address, isWritable: true, isSigner: false },
    // tick_array_1
    { pubkey: tickArrays[1].address, isWritable: true, isSigner: false },
    // tick_array_2
    { pubkey: tickArrays[2].address, isWritable: true, isSigner: false },
    // oracle
    { pubkey: (await PublicKey.findProgramAddress([ Buffer.from('oracle'), new PublicKey(pool.toString()).toBuffer() ], new PublicKey(exchange.router.v1.address)))[0], isWritable: false, isSigner: false },
  ]
}

const getSwapInstructionData = ({ amount, otherAmountThreshold, sqrtPriceLimit, amountSpecifiedIsInput, aToB })=> {
  let LAYOUT, data
  
  LAYOUT = struct([
    u64("anchorDiscriminator"),
    u64("amount"),
    u64("otherAmountThreshold"),
    u128("sqrtPriceLimit"),
    bool("amountSpecifiedIsInput"),
    bool("aToB"),
  ])
  data = Buffer.alloc(LAYOUT.span)
  LAYOUT.encode(
    {
      anchorDiscriminator: SWAP_INSTRUCTION,
      amount: new BN(amount.toString()),
      otherAmountThreshold: new BN(otherAmountThreshold.toString()),
      sqrtPriceLimit,
      amountSpecifiedIsInput,
      aToB,
    },
    data,
  )

  return data
}

const getTransaction = async ({
  exchange,
  path,
  amountIn,
  amountInMax,
  amountOut,
  amountOutMin,
  amounts,
  amountInInput,
  amountOutInput,
  amountInMaxInput,
  amountOutMinInput,
  fromAddress
}) => {
  let transaction = { blockchain: 'solana' }
  let instructions = []

  const fixedPath = fixPath(path)
  if(fixedPath.length > 3) { throw 'Orca can only handle fixed paths with a max length of 3 (2 pools)!' }
  const tokenIn = fixedPath[0]
  const tokenMiddle = fixedPath.length == 3 ? fixedPath[1] : undefined
  const tokenOut = fixedPath[fixedPath.length-1]

  let pairs, amountMiddle
  if(fixedPath.length == 2) {
    pairs = [await getBestPair({ tokenIn, tokenOut, amountIn: (amountInInput || amountInMaxInput), amountOut: (amountOutInput || amountOutMinInput) })]
  } else {
    if(amountInInput || amountInMaxInput) {
      pairs = [await getBestPair({ tokenIn, tokenOut: tokenMiddle, amountIn: (amountInInput || amountInMaxInput) })]
      pairs.push(await getBestPair({ tokenIn: tokenMiddle, tokenOut, amountIn: pairs[0].price }))
    } else { // originally amountOut
      pairs = [await getBestPair({ tokenIn: tokenMiddle, tokenOut, amountOut: (amountOutInput || amountOutMinInput) })]
      pairs.unshift(await getBestPair({ tokenIn, tokenOut: tokenMiddle, amountOut: pairs[0].price }))
    }
  }

  let startsWrapped = (path[0] === blockchain.currency.address && fixedPath[0] === blockchain.wrapped.address)
  let endsUnwrapped = (path[path.length-1] === blockchain.currency.address && fixedPath[fixedPath.length-1] === blockchain.wrapped.address)
  let wrappedAccount
  const provider = await getProvider('solana')
  
  if(startsWrapped || endsUnwrapped) {
    const rent = await provider.getMinimumBalanceForRentExemption(Token.solana.TOKEN_LAYOUT.span)
    const keypair = Keypair.generate()
    wrappedAccount = keypair.publicKey.toString()
    const lamports = startsWrapped ? new BN(amountIn.toString()).add(new BN(rent)) :  new BN(rent)
    let createAccountInstruction = SystemProgram.createAccount({
      fromPubkey: new PublicKey(fromAddress),
      newAccountPubkey: new PublicKey(wrappedAccount),
      programId: new PublicKey(Token.solana.TOKEN_PROGRAM),
      space: Token.solana.TOKEN_LAYOUT.span,
      lamports
    })
    createAccountInstruction.signers = [keypair]
    instructions.push(createAccountInstruction)
    instructions.push(
      Token.solana.initializeAccountInstruction({
        account: wrappedAccount,
        token: blockchain.wrapped.address,
        owner: fromAddress
      })
    )
  }

  if(pairs.length === 1) {
    // amount is NOT the precise part of the swap (otherAmountThreshold is)
    let amountSpecifiedIsInput = !!(amountInInput || amountOutMinInput)
    let amount = amountSpecifiedIsInput ? amountIn : amountOut
    let otherAmountThreshold = amountSpecifiedIsInput ? amountOutMin : amountInMax
    let tokenAccountIn = startsWrapped ? new PublicKey(wrappedAccount) : new PublicKey(await Token.solana.findProgramAddress({ owner: fromAddress, token: tokenIn }))
    let tokenAccountOut = endsUnwrapped ? new PublicKey(wrappedAccount) : new PublicKey(await Token.solana.findProgramAddress({ owner: fromAddress, token: tokenOut }))
    if(!endsUnwrapped) {
      await createTokenAccountIfNotExisting({ instructions, owner: fromAddress, token: tokenOut, account: tokenAccountOut })
    }
    instructions.push(
      new TransactionInstruction({
        programId: new PublicKey(exchange.router.v1.address),
        keys: await getSwapInstructionKeys({
          fromAddress,
          pool: pairs[0].pubkey,
          tokenAccountA: pairs[0].aToB ? tokenAccountIn : tokenAccountOut,
          tokenVaultA: pairs[0].data.tokenVaultA,
          tokenAccountB: pairs[0].aToB ? tokenAccountOut : tokenAccountIn,
          tokenVaultB: pairs[0].data.tokenVaultB,
          tickArrays: pairs[0].tickArrays,
        }),
        data: getSwapInstructionData({
          amount,
          otherAmountThreshold,
          sqrtPriceLimit: pairs[0].sqrtPriceLimit,
          amountSpecifiedIsInput,
          aToB: pairs[0].aToB
        }),
      })
    )
  } else if (pairs.length === 2) {
    // amount is NOT the precise part of the swap (otherAmountThreshold is)
    let amountSpecifiedIsInput = !!(amountInInput || amountOutMinInput)
    let amount = amountSpecifiedIsInput ? amountIn : amountOut
    let otherAmountThreshold = amountSpecifiedIsInput ? amountOutMin : amountInMax
    let tokenAccountIn = startsWrapped ? new PublicKey(wrappedAccount) : new PublicKey(await Token.solana.findProgramAddress({ owner: fromAddress, token: tokenIn }))
    let tokenMiddle = fixedPath[1]
    let tokenAccountMiddle = new PublicKey(await Token.solana.findProgramAddress({ owner: fromAddress, token: tokenMiddle }))
    await createTokenAccountIfNotExisting({ instructions, owner: fromAddress, token: tokenMiddle, account: tokenAccountMiddle })
    let tokenAccountOut = endsUnwrapped ? new PublicKey(wrappedAccount) : new PublicKey(await Token.solana.findProgramAddress({ owner: fromAddress, token: tokenOut }))
    if(!endsUnwrapped) {
      await createTokenAccountIfNotExisting({ instructions, owner: fromAddress, token: tokenOut, account: tokenAccountOut })
    }
    instructions.push(
      new TransactionInstruction({
        programId: new PublicKey(exchange.router.v1.address),
        keys: await getTwoHopSwapInstructionKeys({
          fromAddress,
          poolOne: pairs[0].pubkey,
          tickArraysOne: pairs[0].tickArrays,
          tokenAccountOneA: pairs[0].aToB ? tokenAccountIn : tokenAccountMiddle,
          tokenVaultOneA: pairs[0].data.tokenVaultA,
          tokenAccountOneB: pairs[0].aToB ? tokenAccountMiddle : tokenAccountIn,
          tokenVaultOneB: pairs[0].data.tokenVaultB,
          poolTwo: pairs[1].pubkey,
          tickArraysTwo: pairs[1].tickArrays,
          tokenAccountTwoA: pairs[1].aToB ? tokenAccountMiddle : tokenAccountOut,
          tokenVaultTwoA: pairs[1].data.tokenVaultA,
          tokenAccountTwoB: pairs[1].aToB ? tokenAccountOut : tokenAccountMiddle,
          tokenVaultTwoB: pairs[1].data.tokenVaultB,
        }),
        data: getTwoHopSwapInstructionData({
          amount,
          otherAmountThreshold,
          amountSpecifiedIsInput,
          aToBOne: pairs[0].aToB,
          aToBTwo: pairs[1].aToB,
          sqrtPriceLimitOne: pairs[0].sqrtPriceLimit,
          sqrtPriceLimitTwo: pairs[1].sqrtPriceLimit,
        }),
      })
    )
  }
  
  if(startsWrapped || endsUnwrapped) {
    instructions.push(
      Token.solana.closeAccountInstruction({
        account: wrappedAccount,
        owner: fromAddress
      })
    )
  }

  // await debug(instructions, provider)

  transaction.instructions = instructions
  return transaction
}

const debug = async(instructions, provider)=>{
  console.log('instructions.length', instructions.length)
  let data
  instructions.forEach((instruction)=>{
    console.log('INSTRUCTION.programId', instruction.programId.toString())
    console.log('INSTRUCTION.keys', instruction.keys)
    try {
      const LAYOUT = struct([
        u64("anchorDiscriminator"),
        u64("amount"),
        u64("otherAmountThreshold"),
        u128("sqrtPriceLimit"),
        bool("amountSpecifiedIsInput"),
        bool("aToB"),
      ])
      data = LAYOUT.decode(instruction.data)
    } catch {}
  })
  if(data) {
    console.log('INSTRUCTION.data', data)
    console.log('amount', data.amount.toString())
    console.log('otherAmountThreshold', data.otherAmountThreshold.toString())
    console.log('sqrtPriceLimit', data.sqrtPriceLimit.toString())
  }
  let simulation = new Transaction({ feePayer: new PublicKey('2UgCJaHU5y8NC4uWQcZYeV9a5RyYLF7iKYCybCsdFFD1') })
  instructions.forEach((instruction)=>simulation.add(instruction))
  let result
  console.log('SIMULATE')
  try{ result = await provider.simulateTransaction(simulation) } catch(e) { console.log('error', e) }
  console.log('SIMULATION RESULT', result)
}

export {
  getTransaction,
  SWAP_INSTRUCTION,
  TWO_HOP_SWAP_INSTRUCTION,
  getSwapInstructionKeys,
  getTwoHopSwapInstructionKeys,
}
