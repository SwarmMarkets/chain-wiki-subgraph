import { ByteArray, crypto } from '@graphprotocol/graph-ts'

export function stringToByteArray(str: string): ByteArray {
  return crypto.keccak256(ByteArray.fromUTF8(str))
}
