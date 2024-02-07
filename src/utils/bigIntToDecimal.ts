import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'
import { BI_10 } from '../constants/math'

export function bigIntToDecimal(amount: BigInt, decimals: i32): BigDecimal {
  let scale = BI_10.pow(decimals as u8).toBigDecimal()
  return amount.toBigDecimal().div(scale)
}
