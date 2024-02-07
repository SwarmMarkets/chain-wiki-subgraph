import { BigDecimal, BigInt, ByteArray } from '@graphprotocol/graph-ts'

export let ZERO_BD = BigDecimal.fromString('0')
export let BD_1 = BigDecimal.fromString('1')
export let BD_2 = BigDecimal.fromString('2')

export let ZERO_BI = BigInt.zero()
export let BI_1 = BigInt.fromI32(1)
export let BI_2 = BigInt.fromI32(2)
export let BI_10 = BigInt.fromI32(10)

export let MAX_UINT_256 = BigInt.fromUnsignedBytes(
  ByteArray.fromHexString(
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  ),
)
