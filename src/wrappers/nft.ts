import {
  Address,
  ByteArray,
  Bytes,
  ethereum,
  json,
  log,
} from '@graphprotocol/graph-ts/index'

import { NFTURIUpdate, NFT as SchematicNFT } from '../types/schema'
import { NFT as NFTTemplate } from '../types/templates'
import { push, remove } from '../utils/array'
import { jsonUtils } from '../utils/json'
import { stringToByteArray } from '../utils/stringToByteArray'

const DEFAULT_ADMIN_ROLE_BYTES = Bytes.fromHexString(
  '0x0000000000000000000000000000000000000000000000000000000000000000',
)
const EDITOR_ROLE_BYTES: ByteArray = stringToByteArray('EDITOR_ROLE')

export class NFT extends SchematicNFT {
  constructor(address: Address) {
    super(address.toHex())

    this.uri = ''
    this.admins = []
    this.editors = []
    this.indexPagesUri = ''
    this.logoUrl = ''
    this.headerBackground = ''

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

  public setUriJson(
    jsonString: string,
    event: ethereum.Event,
    isUriUpdate: boolean = false,
  ): void {
    const nftJsonValue = json.try_fromString(jsonString)

    if (nftJsonValue.isError) {
      log.warning('WARNING: Failed to parse json from string nftId {}', [
        this.id,
      ])
      return
    }

    const nftData = nftJsonValue.value.toObject()

    const jsonLogoUrl = nftData.get('logoUrl')
    const jsonIndexPagesUri = nftData.get('indexPagesUri')
    const jsonUri = nftData.get('uri')
    const jsonName = nftData.get('name')
    const jsonHeaderBackground = nftData.get('headerBackground')

    let previousUri = ''

    if (jsonLogoUrl !== null) {
      const logoUrl = jsonUtils.parseString(jsonLogoUrl)
      if (logoUrl !== null) {
        this.logoUrl = logoUrl
      }
    }
    if (jsonIndexPagesUri !== null) {
      const indexPagesUri = jsonUtils.parseString(jsonIndexPagesUri)
      if (indexPagesUri !== null) {
        this.indexPagesUri = indexPagesUri
      }
    }
    if (jsonUri !== null) {
      const uri = jsonUtils.parseString(jsonUri)
      if (uri !== null) {
        previousUri = this.uri
        this.uri = uri
      }
    }
    if (jsonName !== null) {
      const name = changetype<string>(jsonUtils.parseString(jsonName))
      if (name !== null) {
        this.name = name
      }
    }
    if (jsonHeaderBackground !== null) {
      const headerBackground = changetype<string>(
        jsonUtils.parseString(jsonHeaderBackground),
      )
      if (headerBackground !== null) {
        this.headerBackground = headerBackground
      }
    }

    if (isUriUpdate && previousUri !== '') {
      const updatedNFT = new NFTURIUpdate(
        event.transaction.hash.toHex() + '-' + event.logIndex.toString(),
      )

      const previousURI = changetype<string>(previousUri)
      const newURI = changetype<string>(this.uri)

      updatedNFT.nft = this.id
      updatedNFT.previousURI = previousURI
      updatedNFT.newURI = newURI
      updatedNFT.updatedAt = event.block.timestamp
      updatedNFT.save()
    }
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
