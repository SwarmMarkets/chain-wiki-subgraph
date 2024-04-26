import { Address, BigInt, json, log } from '@graphprotocol/graph-ts/index'

import { Token as SchematicToken } from '../types/schema'
import { jsonUtils } from '../utils/json'

class NFTTokenChangedFields {
  name: string | null
  uri: string | null
  previousUri: string | null
  voteProposalUri: string | null

  constructor() {
    this.name = null
    this.uri = null
    this.previousUri = null
    this.voteProposalUri = null
  }
}

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

  public setUriJson(jsonString: string): NFTTokenChangedFields | null {
    const tokenJsonValue = json.try_fromString(jsonString)

    if (tokenJsonValue.isError) {
      log.warning('WARNING: Failed to parse json from string tokenId {}', [
        this.id,
      ])
      return null
    }

    const tokenData = tokenJsonValue.value.toObject()

    const jsonUri = tokenData.get('uri')
    const jsonName = tokenData.get('name')
    const jsonVoteProposalUri = tokenData.get('voteProposalUri')

    const changedFields = new NFTTokenChangedFields()
    if (jsonUri !== null) {
      const uri = changetype<string>(jsonUtils.parseString(jsonUri))
      changedFields.uri = uri
      changedFields.previousUri = this.uri
      this.uri = uri
    }
    if (jsonName !== null) {
      const name = changetype<string>(jsonUtils.parseString(jsonName))
      changedFields.name = name
      this.name = name
    }
    if (jsonVoteProposalUri !== null) {
      const voteProposalUri = changetype<string>(
        jsonUtils.parseString(jsonVoteProposalUri),
      )
      changedFields.voteProposalUri = voteProposalUri
      this.voteProposalUri = voteProposalUri
    }

    return changedFields
  }
}
