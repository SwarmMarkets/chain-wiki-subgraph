import {
  Address,
  ByteArray,
  Bytes,
  json,
  log,
} from '@graphprotocol/graph-ts/index'

import { NFT as SchematicNFT } from '../types/schema'
import { NFT as NFTTemplate } from '../types/templates'
import { SX1155NFT as NFTContract } from '../types/templates/NFT/SX1155NFT'
import { push, remove } from '../utils/array'
import { stringToByteArray } from '../utils/stringToByteArray'
import { jsonUtils } from '../utils/json'

const DEFAULT_ADMIN_ROLE_BYTES = Bytes.fromHexString(
  '0x0000000000000000000000000000000000000000000000000000000000000000',
)
const EDITOR_ROLE_BYTES: ByteArray = stringToByteArray('EDITOR_ROLE')

class NFTChangedFields {
  logoUrl: string | null
  indexPagesUri: string | null
  uri: string | null
  previousUri: string | null
  name: string | null

  constructor() {
    this.logoUrl = null
    this.indexPagesUri = null
    this.uri = null
    this.previousUri = null
    this.name = null
  }
}

export class NFT extends SchematicNFT {
  constructor(address: Address) {
    super(address.toHex())

    this.uri = ''
    this.admins = []
    this.editors = []
    this.indexPagesUri = ''
    this.logoUrl = ''

    NFTTemplate.create(address)
  }

  public grantRole(role: Bytes, _account: Address): void {
    const account = Bytes.fromHexString(_account.toHex()) as Bytes

    if (
      role.equals(DEFAULT_ADMIN_ROLE_BYTES) &&
      this.admins.indexOf(account) === -1
    ) {
      this.admins = push<Bytes>(this.admins, account)
    } else if (
      role.equals(EDITOR_ROLE_BYTES) &&
      this.editors.indexOf(account) === -1
    ) {
      this.editors = push<Bytes>(this.editors, account)
    } else {
      log.warning('Unknown role: {} was granted to {}', [
        role.toHex(),
        account.toHex(),
      ])
    }
  }

  public revokeRole(role: Bytes, _account: Address): void {
    const account = Bytes.fromHexString(_account.toHex()) as Bytes

    if (role.equals(DEFAULT_ADMIN_ROLE_BYTES)) {
      this.admins = remove<Bytes>(this.admins, account)
    } else if (role.equals(EDITOR_ROLE_BYTES)) {
      this.editors = remove<Bytes>(this.editors, account)
    } else {
      log.warning('Unknown role: {} was revoked from {}', [
        role.toHex(),
        account.toHex(),
      ])
    }
  }

  public setUriJson(jsonString: string): NFTChangedFields | null {
    const nftJsonValue = json.try_fromString(jsonString)

    if (nftJsonValue.isError) {
      log.warning('WARNING: Failed to parse json from string nftId {}', [
        this.id,
      ])
      return null
    }

    const nftData = nftJsonValue.value.toObject()

    const jsonLogoUrl = nftData.get('logoUrl')
    const jsonIndexPagesUri = nftData.get('indexPagesUri')
    const jsonUri = nftData.get('uri')
    const jsonName = nftData.get('name')

    const changedFields = new NFTChangedFields()
    if (jsonLogoUrl !== null) {
      const logoUrl = jsonUtils.parseString(jsonLogoUrl)
      if (logoUrl !== null) {
        this.logoUrl = logoUrl
        changedFields.logoUrl = logoUrl
      }
    }
    if (jsonIndexPagesUri !== null) {
      const indexPagesUri = jsonUtils.parseString(jsonIndexPagesUri)
      if (indexPagesUri !== null) {
        this.indexPagesUri = indexPagesUri
        changedFields.indexPagesUri = indexPagesUri
      }
    }
    if (jsonUri !== null) {
      const uri = jsonUtils.parseString(jsonUri)
      if (uri !== null) {
        changedFields.previousUri = this.uri
        changedFields.uri = uri
        this.uri = uri
      }
    }
    if (jsonName !== null) {
      const name = changetype<string>(jsonUtils.parseString(jsonName))
      if (name !== null) {
        this.name = name
        changedFields.name = name
      }
    }

    return changedFields
  }

  static safeLoad(id: string): NFT | null {
    let nft = NFT.load(id)

    if (nft === null) {
      log.warning('NFT not found: {}', [id])
      return null
    }

    return changetype<NFT>(nft)
  }

  static mustLoad(id: string): NFT {
    let nft = NFT.load(id)

    if (nft === null) {
      log.critical('NFT not found: {}', [id])
    }

    return changetype<NFT>(nft)
  }
}
