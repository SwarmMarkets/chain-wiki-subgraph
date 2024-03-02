import { ContractURISet } from '../../types/NFTFactory/SX1155NFT'
import { NFTURIUpdate } from '../../types/schema'
import { NFT } from '../../wrappers'

export function handleUpdateNFTUri(event: ContractURISet): void {
  const nft = NFT.mustLoad(event.address.toHexString())

  const updatedNFT = new NFTURIUpdate(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString(),
  )
  updatedNFT.nft = nft.id
  updatedNFT.previousURI = nft.uri
  updatedNFT.newURI = event.params.uri
  updatedNFT.updatedAt = event.block.timestamp
  updatedNFT.save()

  nft.uri = event.params.uri
  nft.save()
}
