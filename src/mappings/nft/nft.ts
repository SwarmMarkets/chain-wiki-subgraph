import { json, log, JSONValue } from '@graphprotocol/graph-ts'
import { ContractURISet } from '../../types/NFTFactory/SX1155NFT'
import { NFTURIUpdate } from '../../types/schema'
import { jsonUtils } from '../../utils/json'
import { NFT } from '../../wrappers'

export function handleUpdateNFTUri(event: ContractURISet): void {
  const nft = NFT.mustLoad(event.address.toHexString())

  const nftJsonValue = json.try_fromString(event.params.uri)

  if (nftJsonValue.isError) {
    log.warning('WARNING: Failed to parse json from string nftId {}', [nft.id])
    return
  }

  const nftData = nftJsonValue.value.toObject()

  if (nftData.entries.length === 0) {
    log.warning('WARNING: JSON is empty commentId {}', [nft.id])
    return
  }

  const jsonLogoUrl = nftData.get('logoUri')
  const jsonIndexPagesUri = nftData.get('indexPagesUri')
  const jsonUri = nftData.get('uri')
  const jsonName = nftData.get('name')

  if (
    jsonLogoUrl === null &&
    jsonIndexPagesUri === null &&
    jsonUri === null &&
    jsonName === null
  ) {
    log.warning('WARNING: Invalid JSON format {}', [nft.id])
    return
  }

  const logoUrl = changetype<string>(jsonUtils.parseString(jsonLogoUrl))
  const indexPagesUri = changetype<string>(
    jsonUtils.parseString(jsonIndexPagesUri),
  )
  const uri = changetype<string>(jsonUtils.parseString(jsonUri))
  const name = changetype<string>(jsonUtils.parseString(jsonName))

  if (logoUrl !== null) {
    nft.logoUrl = logoUrl
  }
  if (indexPagesUri !== null) {
    nft.indexPagesUri = indexPagesUri
  }
  if (name !== null) {
    nft.name = name
  }

  if (uri !== null) {
    const updatedNFT = new NFTURIUpdate(
      event.transaction.hash.toHex() + '-' + event.logIndex.toString(),
    )
    updatedNFT.nft = nft.id
    updatedNFT.previousURI = nft.uri
    updatedNFT.newURI = uri
    updatedNFT.updatedAt = event.block.timestamp
    updatedNFT.save()

    nft.uri = uri
  }

  nft.save()
}
