import { Address, BigInt, log } from '@graphprotocol/graph-ts/index'

import { Token as SchematicToken } from '../types/schema'

export class Token extends SchematicToken {
  constructor(nftAddress: Address, tokenId: BigInt) {
    const address = nftAddress.toHexString()
    const id = tokenId.toHexString()
    super(`${address}-${id}`)

    this.uri = ''
  }

  static safeLoad(nftAddress: Address, tokenId: BigInt): Token | null {
    const address = nftAddress.toHexString()
    const id = tokenId.toHexString()
    let token = Token.load(`${address}${id}`)

    if (token === null) {
      log.warning('Token not found: {}', [id])
      return null
    }

    return changetype<Token>(token)
  }

  static mustLoad(nftAddress: Address, tokenId: BigInt): Token {
    const address = nftAddress.toHexString()
    const id = tokenId.toHexString()
    let token = Token.load(`${address}-${id}`)

    if (token === null) {
      log.critical('Token not found: {}', [id])
    }

    return changetype<Token>(token)
  }
}
