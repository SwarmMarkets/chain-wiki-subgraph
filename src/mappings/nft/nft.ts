import { NFTURIUpdate } from '../../types/schema'
import { KyaUpdated } from '../../types/templates/NFT/SX1155NFT'
import { NFT } from '../../wrappers'

export function handleUpdateNFTKya(event: KyaUpdated): void {
  const nft = NFT.mustLoad(event.address.toHexString())

  const updatedNFT = new NFTURIUpdate(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString(),
  )
  updatedNFT.nft = nft.id
  updatedNFT.previousURI = nft.uri
  updatedNFT.newURI = event.params.kya
  updatedNFT.updatedAt = event.block.timestamp
  updatedNFT.save()

  nft.uri = event.params.kya
  nft.save()
}
