import {
  Address,
  BigInt,
  ethereum,
  json,
  log,
} from '@graphprotocol/graph-ts/index'

import { Token as SchematicToken, TokenURIUpdate } from '../types/schema'
import { jsonUtils } from '../utils/json'

export class Token extends SchematicToken {
  constructor(nftAddress: Address, tokenId: BigInt) {
    const id = Token.buildID(nftAddress, tokenId)
    super(id)

    this.uri = ''
    this.name = ''
    this.voteProposalUri = ''
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

  public setUriJson(
    jsonString: string,
    event: ethereum.Event,
    isUriUpdate: boolean = false,
  ): void {
    const tokenJsonValue = json.try_fromString(jsonString)

    if (tokenJsonValue.isError) {
      log.warning('WARNING: Failed to parse json from string tokenId {}', [
        this.id,
      ])
      return
    }

    const tokenData = tokenJsonValue.value.toObject()

    const jsonUri = tokenData.get('uri')
    const jsonName = tokenData.get('name')
    const jsonVoteProposalUri = tokenData.get('voteProposalUri')

    let previousUri = ''

    if (jsonUri !== null) {
      const uri = jsonUtils.parseString(jsonUri)
      if (uri !== null) {
        previousUri = this.uri
        this.uri = uri
      }
    }
    if (jsonName !== null) {
      const name = jsonUtils.parseString(jsonName)
      if (name !== null) {
        this.name = name
      }
    }
    if (jsonVoteProposalUri !== null) {
      const voteProposalUri = jsonUtils.parseString(jsonVoteProposalUri)
      if (voteProposalUri !== null) {
        this.voteProposalUri = voteProposalUri
      }
    }

    if (isUriUpdate && previousUri !== '') {
      const updatedToken = new TokenURIUpdate(
        event.transaction.hash.toHexString() +
          '-' +
          event.logIndex.toHexString(),
      )

      updatedToken.updatedAt = event.block.timestamp
      updatedToken.token = this.id
      updatedToken.nft = this.nft
      updatedToken.newURI = this.uri
      updatedToken.previousURI = previousUri
      updatedToken.save()
    }
  }
}
