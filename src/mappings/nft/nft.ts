import { ContractURISet } from '../../types/NFTFactory/SX1155NFT'
import { NFTURIUpdate } from '../../types/schema'
import { NFT } from '../../wrappers'

export function handleUpdateNFTUri(event: ContractURISet): void {
  const nft = NFT.mustLoad(event.address.toHexString())

  const changedFields = nft.setUriJson(event.params.uri)

  if (
    changedFields !== null &&
    changedFields.uri !== null &&
    changedFields.previousUri !== null
  ) {
    const updatedNFT = new NFTURIUpdate(
      event.transaction.hash.toHex() + '-' + event.logIndex.toString(),
    )

    const previousURI = changetype<string>(changedFields.previousUri)
    const newURI = changetype<string>(changedFields.uri)

    updatedNFT.nft = nft.id
    updatedNFT.previousURI = previousURI
    updatedNFT.newURI = newURI
    updatedNFT.updatedAt = event.block.timestamp
    updatedNFT.save()
  }

  nft.save()
}
