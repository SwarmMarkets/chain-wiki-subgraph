import { Address, BigInt, log } from '@graphprotocol/graph-ts/index'

import { Token as SchematicToken } from '../types/schema'

export class Token extends SchematicToken {
  constructor(nftAddress: Address, tokenId: BigInt) {
    const id = Token.buildID(nftAddress, tokenId)
    super(id)

    this.uri = ''
  }

  static buildID(nftAddress: Address, tokenId: BigInt): string {
    const address = nftAddress.toHexString()
    const id = tokenId.toHexString()
    return address.concat('-').concat(id)
  }

  static safeLoad(nftAddress: Address, tokenId: BigInt): Token | null {
    const id = Token.buildID(nftAddress, tokenId)
    let token = Token.load(id)

    if (token === null) {
      log.warning('Token not found: {}', [id])
      return null
    }

    return changetype<Token>(token)
  }

  static mustLoad(nftAddress: Address, tokenId: BigInt): Token {
    const id = Token.buildID(nftAddress, tokenId)
    let token = Token.load(id)

    if (token === null) {
      log.critical('Token not found: {}', [id])
    }

    return changetype<Token>(token)
  }
}
