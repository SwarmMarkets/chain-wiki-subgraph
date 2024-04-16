import {
  Address,
  Bytes,
  JSONValue,
  dataSource,
  json,
  log,
} from '@graphprotocol/graph-ts'
import { SX1155NFTDeployed } from '../../types/NFTFactory/SX1155NFTFactory'
import { NFT, NFTFactory } from '../../wrappers'
import { jsonUtils } from '../../utils/json'

export function handleCreateNFT(event: SX1155NFTDeployed): void {
  let factoryAddress = dataSource.address().toHex()
  let factory = NFTFactory.loadOrCreate(factoryAddress)

  const params = event.params

  let address = changetype<Address>(event.params.deployedAddress)
  let nft = new NFT(address)

  const nftJsonValue = json.try_fromString(event.params.uri)

  if (nftJsonValue.isError) {
    log.warning('WARNING: Failed to parse json from string {}', [])
    return
  }

  const nftData = nftJsonValue.value.toObject()

  if (nftData.entries.length === 0) {
    log.warning('WARNING: JSON is empty commentId {}', [nft.id])
    return
  }

  const jsonLogoUrl = changetype<JSONValue | null>(nftData.get('logoUri'))
  const jsonIndexPagesUri = changetype<JSONValue | null>(
    nftData.get('indexPagesUri'),
  )
  const jsonUri = changetype<JSONValue | null>(nftData.get('uri'))

  if (
    (jsonLogoUrl && jsonLogoUrl.isNull()) ||
    (jsonIndexPagesUri && jsonIndexPagesUri.isNull()) ||
    (jsonUri && jsonUri.isNull())
  ) {
    log.warning('WARNING: Invalid JSON format {}', [nft.id])
    return
  }

  const logoUrl = changetype<string>(jsonUtils.parseString(jsonLogoUrl))
  const indexPagesUri = changetype<string>(
    jsonUtils.parseString(jsonIndexPagesUri),
  )
  const uri = changetype<string>(jsonUtils.parseString(jsonUri))

  nft.logoUrl = logoUrl
  nft.indexPagesUri = indexPagesUri
  nft.symbol = params.symbol
  nft.name = params.name
  nft.uri = uri

  const editor = Bytes.fromHexString(event.params.editor.toHex())
  const admin = Bytes.fromHexString(event.params.admin.toHex())

  nft.admins = [admin]
  nft.editors = [editor]

  nft.updatedAt = event.block.timestamp
  nft.createdAt = event.block.timestamp
  nft.creator = event.params.admin

  nft.save()
  factory.save()
}
